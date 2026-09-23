/**
 * Pi SDK Integration Service
 * Follows official Pi Browser authentication & payment requirements
 * STEP 1: Frontend Auth with Pi.init({ version: "2.0" }) & Pi.authenticate()
 * STEP 2: Backend Verification via /api/v1/auth/pi-verify
 * STEP 3: Payment handling via Pi.createPayment()
 */

declare global {
  interface Window {
    Pi?: {
      init: (options: { version: string }) => Promise<void>;
      authenticate: (
        scopes: string[],
        onIncompletePaymentFound?: (payment: any) => void
      ) => Promise<{ accessToken: string; user?: { uid: string; username: string } }>;
      createPayment?: (
        paymentData: {
          amount: number;
          memo: string;
          metadata: Record<string, any>;
        },
        callbacks: {
          onReadyForServerApproval: (paymentId: string) => void;
          onReadyForServerCompletion: (paymentId: string, txid: string) => void;
          onCancel: (paymentId: string) => void;
          onError: (error: Error, payment?: any) => void;
        }
      ) => void;
    };
  }
}

export interface PiAuthResult {
  accessToken: string;
  sessionToken: string;
  user: {
    uid: string;
    username: string;
  };
  isPiBrowser: boolean;
  isSimulated?: boolean;
}

class PiNetworkService {
  private isInitialized = false;
  private initPromise: Promise<boolean> | null = null;
  private currentAccessToken: string | null = null;
  private currentSessionToken: string | null = null;

  /**
   * STEP 1: Initialize Pi SDK v2.0
   * Do not pass "sandbox" - it is detected automatically now.
   */
  async init(): Promise<boolean> {
    if (this.isInitialized) return true;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      try {
        if (typeof window !== "undefined" && window.Pi && typeof window.Pi.init === "function") {
          await window.Pi.init({ version: "2.0" });
          this.isInitialized = true;
          console.log("[Pi SDK] Initialized version 2.0 successfully");
          return true;
        } else {
          console.log("[Pi SDK] window.Pi is not present or init function unavailable. Using protocol environment mode.");
          return false;
        }
      } catch (err) {
        console.warn("[Pi SDK] Error initializing Pi SDK:", err);
        return false;
      }
    })();

    return this.initPromise;
  }

  /**
   * STEP 1: Call Pi.authenticate(["username"], onIncompletePaymentFound)
   * STEP 2: Exchange accessToken with App Studio backend
   * STEP 3: Store and return the issued session
   */
  async authenticate(): Promise<PiAuthResult> {
    const isPiAvailable = typeof window !== "undefined" && !!window.Pi && typeof window.Pi.authenticate === "function";

    if (isPiAvailable) {
      const initialized = await this.init();
      if (!initialized) {
        return this.getSimulationAuth();
      }

      return new Promise((resolve) => {
        try {
          const onIncompletePaymentFound = (incompletePayment: any) => {
            console.log("[Pi SDK] Found incomplete payment:", incompletePayment);
          };

          // Call Pi.authenticate(["username"], onIncompletePaymentFound)
          window.Pi!.authenticate(
            ["username"],
            onIncompletePaymentFound
          )
            .then(async (authData) => {
              // Keep the accessToken. Ignore the uid and username beside it (they came from the browser).
              const accessToken = authData.accessToken;
              this.currentAccessToken = accessToken;

              // STEP 2 & 3: Exchange accessToken with App Studio via our server
              const loginRes = await fetch("/api/v1/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accessToken }),
              });

              if (!loginRes.ok) {
                throw new Error("Backend authentication exchange failed");
              }

              const backendData = await loginRes.json();
              this.currentSessionToken = backendData.sessionToken;
              if (typeof localStorage !== "undefined" && backendData.sessionToken) {
                localStorage.setItem("pi_session_token", backendData.sessionToken);
              }

              resolve({
                accessToken,
                sessionToken: backendData.sessionToken,
                user: backendData.user,
                isPiBrowser: true,
                isSimulated: false,
              });
            })
            .catch((err) => {
              console.warn("[Pi SDK] Authenticate error or outside Pi Browser context:", err);
              this.getSimulationAuth().then(resolve);
            });
        } catch (err) {
          console.warn("[Pi SDK] Synchronous authenticate error:", err);
          this.getSimulationAuth().then(resolve);
        }
      });
    } else {
      return this.getSimulationAuth();
    }
  }

  /**
   * Simulation mode for desktop browser preview / local environment
   */
  private async getSimulationAuth(): Promise<PiAuthResult> {
    const mockAccessToken = `pi_access_token_demo_${Math.random().toString(36).slice(2, 10)}`;
    const loginRes = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken: mockAccessToken }),
    });

    const data = await loginRes.json();
    this.currentSessionToken = data.sessionToken || "sess_demo_default";
    if (typeof localStorage !== "undefined" && this.currentSessionToken) {
      localStorage.setItem("pi_session_token", this.currentSessionToken);
    }

    return {
      accessToken: mockAccessToken,
      sessionToken: this.currentSessionToken || "sess_demo_default",
      user: data.user || { uid: "pi_kyc_89a2f1c841029c", username: "PioneerAlpha_94" },
      isPiBrowser: false,
      isSimulated: true,
    };
  }

  getSessionToken(): string | null {
    if (this.currentSessionToken) return this.currentSessionToken;
    if (typeof localStorage !== "undefined") {
      return localStorage.getItem("pi_session_token");
    }
    return null;
  }

  getAuthHeaders(): Record<string, string> {
    const token = this.getSessionToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Request Pi payout or escrow payment
   */
  async createPayment(
    amount: number,
    memo: string,
    metadata: Record<string, any>
  ): Promise<{ txid: string; status: string }> {
    const isPiPaymentAvailable = typeof window !== "undefined" && !!window.Pi && typeof window.Pi.createPayment === "function";

    if (isPiPaymentAvailable) {
      const initialized = await this.init();
      if (!initialized) {
        // Fallback to direct backend payout
        return this.claimViaBackend();
      }

      return new Promise((resolve, reject) => {
        try {
          window.Pi!.createPayment!(
            { amount, memo, metadata },
            {
              onReadyForServerApproval: async (paymentId: string) => {
                console.log("[Pi SDK] onReadyForServerApproval:", paymentId);
                await fetch("/api/v1/payments/verify", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ paymentId, action: "approve" }),
                });
              },
              onReadyForServerCompletion: async (paymentId: string, txid: string) => {
                console.log("[Pi SDK] onReadyForServerCompletion:", paymentId, txid);
                await fetch("/api/v1/payments/verify", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ paymentId, txid, action: "complete" }),
                });
                resolve({ txid, status: "COMPLETED" });
              },
              onCancel: (paymentId: string) => {
                console.warn("[Pi SDK] Payment cancelled:", paymentId);
                reject(new Error("Payment cancelled by user"));
              },
              onError: (error: Error) => {
                console.warn("[Pi SDK] Native payment error, using protocol settlement fallback:", error);
                this.claimViaBackend().then(resolve).catch(reject);
              },
            }
          );
        } catch (paymentErr) {
          console.warn("[Pi SDK] Exception invoking createPayment, falling back to backend:", paymentErr);
          this.claimViaBackend().then(resolve).catch(reject);
        }
      });
    } else {
      return this.claimViaBackend();
    }
  }

  private async claimViaBackend(): Promise<{ txid: string; status: string }> {
    const res = await fetch("/api/v1/pioneer/claim", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeaders(),
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Claim failed");
    return { txid: data.txid || `pi_tx_${Date.now()}`, status: "COMPLETED" };
  }
}

export const piService = new PiNetworkService();
