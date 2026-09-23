/**
 * Pi Humanity Protocol - Core Type Definitions
 * Domain: humanity.pi - "60 Million Verified Humans Powering Every AI"
 */

export type KycTier = 'tier_1' | 'tier_2' | 'unverified';

export interface PioneerUser {
  uid: string;
  username: string;
  name?: string;
  kycTier: KycTier;
  kycVerifiedAt: string;
  country: string;
  countryFlag: string;
  walletAddress: string;
  trustScore: number; // 0 - 100
  tasksCompleted: number;
  piEarned: number;
  unpaidPiBalance: number;
  isFounder?: boolean;
  founderRole?: string;
  sessionToken?: string;
  isSimulated?: boolean;
}

export type TaskType = 
  | 'ai_audit'           // RLHF Toxicity, bias, safety evaluation
  | 'data_label'          // Multimodal, visual, categorization
  | 'content_review'      // LLM Hallucination & factual verification
  | 'localization_verify';// Native linguistic nuance in 230 countries

export interface TaskOption {
  label: string;
  value: string;
  color?: string; // 'emerald' | 'rose' | 'amber' | 'blue'
  description?: string;
}

export interface TaskVote {
  pioneerUid: string;
  pioneerUsername: string;
  choice: string;
  trustScore: number;
  timestamp: number;
}

export interface TaskItem {
  id: string;
  taskId: string;
  prompt: string;
  context?: string;
  candidateContent: string;
  category: string;
  language: string;
  options: TaskOption[];
  requiredConsensus: number; // default: 3
  votes: TaskVote[];
  consensusReached: boolean;
  consensusChoice?: string;
  agreementRatio?: string; // e.g. "3/3" or "2/3"
  isToxicOrViolating?: boolean;
}

export interface HumanTask {
  id: string;
  title: string;
  companyName: string;
  companyLogo?: string;
  type: TaskType;
  description: string;
  totalItems: number;
  requiredHumansPerItem: number;
  bountyPi: number;
  fiatPaidUsd: number;
  pioneerRewardPerItemPi: number;
  protocolFeePi: number;
  status: 'escrow_locked' | 'in_progress' | 'consensus_reached' | 'settled';
  completedItemsCount: number;
  createdAt: string;
  consensusReachedAt?: string;
  items: TaskItem[];
  proofCertificateHash?: string;
  ipfsCid?: string;
  tags: string[];
}

export interface ProofCertificate {
  certificateId: string;
  taskId: string;
  taskTitle: string;
  companyName: string;
  taskType: TaskType;
  totalVerifiedHumans: number;
  uniqueKycUidsHash: string; // SHA-256 fingerprint of all KYC'd pioneers
  consensusAccuracy: number; // e.g. 98.7%
  countriesRepresented: string[];
  issuedAt: string;
  ipfsHash: string;
  escrowSettlementTx: string;
  piNetworkAnchorBlock: number;
  euAiActComplianceToken: string;
  itemsBreakdown: {
    itemId: string;
    consensusChoice: string;
    agreementRatio: string;
    verifiedKycHumansCount: number;
  }[];
}

export interface BlockEvent {
  blockNumber: number;
  hash: string;
  txCount: number;
  timestamp: string;
  validatorNode: string;
  piRewardDistributed: number;
  consensusType: string;
  kycQuorumSize: number;
}

export interface VerificationNode {
  id: string;
  city: string;
  country: string;
  countryCode: string;
  flag: string;
  verifiedPioneers: string;
  activeNodes: number;
  latencyMs: number;
  consensusRate: number;
  languages: string[];
}

export interface ProtocolStats {
  totalVerifiedHumans: number; // 60,000,000+
  tasksToday: number;
  revenueTodayUsd: number;
  piDistributed: number;
  escrowLockedPi: number;
  activeWorkersOnline: number;
  avgConsensusSeconds: number;
  latestBlock: number;
  piNetworkMainnetStatus: 'HEALTHY' | 'SYNCED';
  totalStakedPi?: number;
  byzantineToleranceRatio?: number;
  oracleQueriesServed?: number;
  liveActivityPings: {
    id: string;
    pioneer: string;
    country: string;
    flag: string;
    taskType: string;
    action: string;
    rewardPi: number;
    timeAgo: string;
  }[];
}
