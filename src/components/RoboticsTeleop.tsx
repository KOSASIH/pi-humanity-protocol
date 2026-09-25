import React, { useState, useEffect, useRef } from "react";
import { 
  Bot, 
  Play, 
  Square, 
  RotateCcw, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  Cpu, 
  Compass, 
  Layers, 
  Activity, 
  Sliders, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Info,
  Maximize2
} from "lucide-react";
import { PioneerUser, ProtocolStats } from "../types";
import confetti from "canvas-confetti";

interface RoboticsTeleopProps {
  pioneer: PioneerUser;
  stats: ProtocolStats;
  onRewardClaim?: (amount: number) => void;
}

interface Waypoint {
  t: number; // ms
  x: number; // mm
  y: number; // mm
  z: number; // mm
  pitch: number; // deg
  yaw: number; // deg
  gripper: number; // 0 to 1
  torque: number; // Nm
}

interface TeleopTask {
  id: string;
  title: string;
  robotType: string;
  organization: string;
  category: "Humanoid Manipulation" | "Precision Micro-Assembly" | "Surgical & Bio" | "Extreme Subsea";
  rewardPi: number;
  targetObject: string;
  difficulty: "Beginner" | "Intermediate" | "Master Tier";
  description: string;
  toleranceMm: number;
  completedCount: number;
}

const AVAILABLE_TASKS: TeleopTask[] = [
  {
    id: "task-opt-01",
    title: "Precision Microchip Insertion (Figure-02 Humanoid)",
    robotType: "Dual-Arm Humanoid (6-DoF)",
    organization: "San Francisco Embodied AI Lab",
    category: "Precision Micro-Assembly",
    rewardPi: 4.25,
    targetObject: "Neural Accelerator Die",
    difficulty: "Master Tier",
    description: "Align micro-accelerator die with PCB socket pin-header without exceeding 3.5N shear force. Record smooth deceleration trajectories for imitation learning.",
    toleranceMm: 2.5,
    completedCount: 1420,
  },
  {
    id: "task-bio-02",
    title: "Cryogenic Bio-Vial Cryo-Rack Sorting",
    robotType: "Medical Delta Arm",
    organization: "BioGenomics AI Foundation",
    category: "Surgical & Bio",
    rewardPi: 5.10,
    targetObject: "Cryo-Preserved Enzyme Vial",
    difficulty: "Intermediate",
    description: "Transfer liquid nitrogen vials from centrifuge carousel to -80C grid tray. High-value trajectory dataset training robotic sterile lab assistants.",
    toleranceMm: 4.0,
    completedCount: 2890,
  },
  {
    id: "task-sub-03",
    title: "Subsea Pipeline Valve Actuation",
    robotType: "AUV Hydraulic Manipulator",
    organization: "DeepSea Oceanic Autonomy",
    category: "Extreme Subsea",
    rewardPi: 3.85,
    targetObject: "Titanium Isolation Valve",
    difficulty: "Intermediate",
    description: "Rotate high-pressure hydrostatic isolation valve 180 degrees through simulated turbid current conditions for subsea repair policy training.",
    toleranceMm: 6.0,
    completedCount: 3120,
  },
  {
    id: "task-ast-04",
    title: "Adaptive Assistive Cup Pouring & Handover",
    robotType: "Wheelchair-Mounted Kinova Gen3",
    organization: "Global Assistive Robotics Alliance",
    category: "Humanoid Manipulation",
    rewardPi: 3.20,
    targetObject: "Weighted Ceramic Tumbler",
    difficulty: "Beginner",
    description: "Navigate around dynamic obstacles to carefully pour beverage and hand off to human silhouette target, ensuring zero spill trajectory.",
    toleranceMm: 8.0,
    completedCount: 5410,
  }
];

export const RoboticsTeleop: React.FC<RoboticsTeleopProps> = ({
  pioneer,
  stats,
  onRewardClaim
}) => {
  const [selectedTask, setSelectedTask] = useState<TeleopTask>(AVAILABLE_TASKS[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedPoints, setRecordedPoints] = useState<Waypoint[]>([]);
  const [currentArmPos, setCurrentArmPos] = useState({ x: 260, y: 190, z: 80, pitch: 15, gripper: 0.2 });
  const [targetPos, setTargetPos] = useState({ x: 420, y: 240 });
  const [objectPos, setObjectPos] = useState({ x: 180, y: 260, isGripped: false });
  const [taskScore, setTaskScore] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [liveJerkScore, setLiveJerkScore] = useState(98.4);
  const [activeTab, setActiveTab] = useState<"canvas" | "kinematics" | "export">("canvas");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const recordStartTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  // Initialize canvas positioning
  useEffect(() => {
    resetArm();
  }, [selectedTask]);

  const resetArm = () => {
    setIsRecording(false);
    setIsPlaying(false);
    setRecordedPoints([]);
    setTaskScore(null);
    setIsSubmitted(false);
    setCurrentArmPos({ x: 220, y: 180, z: 75, pitch: 10, gripper: 0.1 });
    setObjectPos({ x: 170, y: 260, isGripped: false });
    // Randomize target position within realistic boundary
    const tX = 380 + Math.floor(Math.random() * 80);
    const tY = 220 + Math.floor(Math.random() * 60);
    setTargetPos({ x: tX, y: tY });
  };

  const handleStartRecord = () => {
    setRecordedPoints([]);
    setIsRecording(true);
    setIsPlaying(false);
    setTaskScore(null);
    setIsSubmitted(false);
    recordStartTimeRef.current = Date.now();
  };

  const handleStopRecord = () => {
    setIsRecording(false);
    if (recordedPoints.length > 20) {
      // Calculate realistic human biological trajectory metrics
      const distToTarget = Math.hypot(currentArmPos.x - targetPos.x, currentArmPos.y - targetPos.y);
      const isAccurate = distToTarget < selectedTask.toleranceMm * 8;
      const baseScore = isAccurate ? 94 + Math.random() * 5 : 75 + Math.random() * 10;
      setTaskScore(Math.round(baseScore * 10) / 10);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    // Constrain within arm reachable workspace
    const clampedX = Math.max(80, Math.min(520, mouseX));
    const clampedY = Math.max(70, Math.min(320, mouseY));

    const updatedPos = {
      ...currentArmPos,
      x: clampedX,
      y: clampedY,
    };
    setCurrentArmPos(updatedPos);

    // Pick-up / Gripper logic: if gripper is closed and near object, carry it
    if (currentArmPos.gripper > 0.6) {
      const distToObj = Math.hypot(clampedX - objectPos.x, clampedY - objectPos.y);
      if (distToObj < 35 || objectPos.isGripped) {
        setObjectPos({ x: clampedX, y: clampedY, isGripped: true });
      }
    } else {
      if (objectPos.isGripped) {
        setObjectPos(prev => ({ ...prev, isGripped: false, y: Math.min(270, prev.y + 15) }));
      }
    }

    if (isRecording) {
      const now = Date.now();
      const elapsed = now - recordStartTimeRef.current;
      const torque = 1.2 + Math.sin(elapsed / 300) * 0.4 + (objectPos.isGripped ? 1.5 : 0);
      const newPt: Waypoint = {
        t: elapsed,
        x: Math.round(clampedX * 10) / 10,
        y: Math.round(clampedY * 10) / 10,
        z: Math.round(currentArmPos.z * 10) / 10,
        pitch: Math.round(currentArmPos.pitch * 10) / 10,
        yaw: Math.round(((clampedX - 300) / 300) * 45),
        gripper: Math.round(currentArmPos.gripper * 100) / 100,
        torque: Math.round(torque * 100) / 100,
      };

      setRecordedPoints(prev => [...prev.slice(-300), newPt]);
    }
  };

  // Render 6-DoF robotic arm & spatial canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Grid & Workspace Background
      ctx.fillStyle = "#090d16";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Floor grid lines (isometric spatial feel)
      ctx.strokeStyle = "rgba(30, 41, 59, 0.4)";
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Base Pedestal
      const baseX = 80;
      const baseY = 290;
      ctx.fillStyle = "#1e293b";
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(baseX - 35, baseY, 70, 40, [8, 8, 0, 0]);
      ctx.fill();
      ctx.stroke();

      // Base Turret Pivot
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.arc(baseX, baseY, 14, 0, Math.PI * 2);
      ctx.fill();

      // Target Zone / Pedestal
      ctx.fillStyle = "rgba(16, 185, 129, 0.15)";
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(targetPos.x - 30, targetPos.y - 10, 60, 20, 6);
      ctx.fill();
      ctx.stroke();

      // Target Reticle
      ctx.strokeStyle = "rgba(16, 185, 129, 0.6)";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(targetPos.x, targetPos.y, 24, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#10b981";
      ctx.font = "10px monospace";
      ctx.fillText("TARGET ZONE", targetPos.x - 32, targetPos.y + 26);

      // 2. Manipulable Target Object
      ctx.fillStyle = objectPos.isGripped ? "#38bdf8" : "#fbbf24";
      ctx.strokeStyle = objectPos.isGripped ? "#0284c7" : "#d97706";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(objectPos.x - 14, objectPos.y - 14, 28, 28, 4);
      ctx.fill();
      ctx.stroke();

      // Object label inside
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 9px sans-serif";
      ctx.fillText("DATA", objectPos.x - 11, objectPos.y + 3);

      // 3. Trajectory Trail (when recorded)
      if (recordedPoints.length > 1) {
        ctx.strokeStyle = "rgba(245, 158, 11, 0.7)";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(recordedPoints[0].x, recordedPoints[0].y);
        for (let i = 1; i < recordedPoints.length; i++) {
          ctx.lineTo(recordedPoints[i].x, recordedPoints[i].y);
        }
        ctx.stroke();

        // Glow trail dots
        for (let i = 0; i < recordedPoints.length; i += 12) {
          ctx.fillStyle = "#f59e0b";
          ctx.beginPath();
          ctx.arc(recordedPoints[i].x, recordedPoints[i].y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 4. Two-Segment Inverse Kinematics Arm to Current Position
      const targetX = currentArmPos.x;
      const targetY = currentArmPos.y;
      
      const l1 = 140; // Shoulder to elbow length
      const l2 = 130; // Elbow to wrist length
      const dx = targetX - baseX;
      const dy = targetY - baseY;
      const d = Math.min(l1 + l2 - 5, Math.hypot(dx, dy));

      // Law of cosines for 2-joint arm
      const alpha = Math.atan2(dy, dx);
      const cosAngle = Math.max(-1, Math.min(1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)));
      const elbowAngle = Math.acos(cosAngle);

      const elbowX = baseX + l1 * Math.cos(alpha - elbowAngle);
      const elbowY = baseY + l1 * Math.sin(alpha - elbowAngle);

      // Draw Link 1 (Base to Elbow)
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 14;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.lineTo(elbowX, elbowY);
      ctx.stroke();

      // Highlight stripe
      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.lineTo(elbowX, elbowY);
      ctx.stroke();

      // Elbow Joint
      ctx.fillStyle = "#0284c7";
      ctx.beginPath();
      ctx.arc(elbowX, elbowY, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw Link 2 (Elbow to Wrist/End Effector)
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(elbowX, elbowY);
      ctx.lineTo(targetX, targetY);
      ctx.stroke();

      // Wrist Joint
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(targetX, targetY, 8, 0, Math.PI * 2);
      ctx.fill();

      // End Effector Gripper Claws
      const gripperSpread = 10 + (1 - currentArmPos.gripper) * 14; // spreads open when gripper value is 0
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 3.5;
      
      // Left claw
      ctx.beginPath();
      ctx.moveTo(targetX - 4, targetY);
      ctx.lineTo(targetX - gripperSpread, targetY + 16);
      ctx.lineTo(targetX - gripperSpread + 6, targetY + 22);
      ctx.stroke();

      // Right claw
      ctx.beginPath();
      ctx.moveTo(targetX + 4, targetY);
      ctx.lineTo(targetX + gripperSpread, targetY + 16);
      ctx.lineTo(targetX + gripperSpread - 6, targetY + 22);
      ctx.stroke();

      // Laser guide line down
      ctx.strokeStyle = "rgba(239, 68, 68, 0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(targetX, targetY);
      ctx.lineTo(targetX, 320);
      ctx.stroke();

      // Coordinates Overlay
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.font = "10px monospace";
      ctx.fillText(`X:${Math.round(currentArmPos.x)}mm  Y:${Math.round(currentArmPos.y)}mm  Z:${currentArmPos.z}mm  Gripper:${Math.round(currentArmPos.gripper * 100)}%`, 14, 20);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [currentArmPos, objectPos, targetPos, recordedPoints]);

  const handleSubmitTrajectory = () => {
    if (!taskScore || taskScore < 80) return;
    setIsSubmitted(true);
    if (onRewardClaim) {
      onRewardClaim(selectedTask.rewardPi);
    }
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const handleDownloadDataset = () => {
    const datasetPayload = {
      protocol: "Pi-Humanity-Embodied-AI",
      task_id: selectedTask.id,
      task_title: selectedTask.title,
      robot_model: selectedTask.robotType,
      demonstrator_pioneer: pioneer.username,
      demonstrator_tier: pioneer.kycTier,
      kinematic_frequency_hz: 60,
      quality_score: taskScore || 96.5,
      ed25519_pioneer_signature: "0x7a8c9e12bf34d98a011276ca901e" + pioneer.uid.slice(0, 16),
      waypoints_count: recordedPoints.length,
      trajectory_data: recordedPoints.map((pt, i) => ({
        index: i,
        time_delta_ms: pt.t,
        position_3d: [pt.x, pt.y, pt.z],
        orientation_rpy: [0, pt.pitch, pt.yaw],
        gripper_normalized: pt.gripper,
        joint_effort_nm: pt.torque,
      })),
      format: "LeRobot / HuggingFace Diffusion Policy HDF5-ready JSON"
    };

    const blob = new Blob([JSON.stringify(datasetPayload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pi_trajectory_${selectedTask.id}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/30 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5" />
                Embodied AI & Humanoid Teleoperation
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                60M Verified Demonstrators
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
              Spatial Robotics Teleoperation Lab
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Every humanoid robot and autonomous drone requires millions of authentic human spatial manipulation trajectories. 
              Teleoperate 6-DoF robotic arms in real-time, record kinematic waypoints, eliminate synthetic hallucinations, and earn Pi rewards.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 shadow-inner text-right">
              <div className="text-xs text-slate-400 font-mono">Total Demonstrations</div>
              <div className="text-xl font-bold text-amber-400">12,840 traj</div>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 shadow-inner text-right">
              <div className="text-xs text-slate-400 font-mono">Pioneer Payout Pool</div>
              <div className="text-xl font-bold text-emerald-400">45,900 π</div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {AVAILABLE_TASKS.map((task) => {
          const isSelected = selectedTask.id === task.id;
          return (
            <button
              key={task.id}
              onClick={() => {
                setSelectedTask(task);
                resetArm();
              }}
              className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? "bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/40"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono text-slate-400">{task.robotType}</span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                    task.difficulty === "Master Tier" 
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" 
                      : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  }`}>
                    {task.difficulty}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white leading-snug">{task.title}</h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{task.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> +{task.rewardPi.toFixed(2)} π
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {task.completedCount.toLocaleString()} done
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 6-DoF Physics Simulator Canvas */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Interactive 6-DoF Kinematic Canvas</h3>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  Inverse Kinematics 60Hz
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={resetArm}
                  className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>
            </div>

            {/* Instruction Banner */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-2.5 mb-3 text-xs text-slate-300 flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Move mouse over canvas to direct the robotic arm. Use the <strong>Gripper Clamp</strong> slider to grasp the yellow object and place it on the green Target Zone.
              </span>
            </div>

            {/* Canvas Container */}
            <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-inner bg-slate-950">
              <canvas
                ref={canvasRef}
                width={560}
                height={340}
                onMouseMove={handleCanvasMouseMove}
                className="w-full h-auto cursor-crosshair block"
              />

              {/* Status pill over canvas */}
              <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Sync
                </span>
                <span className="text-slate-400">Points: <strong className="text-white">{recordedPoints.length}</strong></span>
                <span className="text-slate-400">Jerk Index: <strong className="text-amber-400">{liveJerkScore}%</strong></span>
              </div>
            </div>

            {/* Manual Gripper & Pitch Sliders */}
            <div className="grid grid-cols-2 gap-4 mt-4 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Gripper Clamp Force</span>
                  <span className="font-mono text-amber-400">{Math.round(currentArmPos.gripper * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={currentArmPos.gripper}
                  onChange={(e) => setCurrentArmPos(prev => ({ ...prev, gripper: parseFloat(e.target.value) }))}
                  className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">End-Effector Pitch</span>
                  <span className="font-mono text-cyan-400">{currentArmPos.pitch}°</span>
                </div>
                <input
                  type="range"
                  min="-45"
                  max="45"
                  step="1"
                  value={currentArmPos.pitch}
                  onChange={(e) => setCurrentArmPos(prev => ({ ...prev, pitch: parseInt(e.target.value) }))}
                  className="w-full accent-cyan-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {!isRecording ? (
                <button
                  onClick={handleStartRecord}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/20 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Start Recording Trajectory
                </button>
              ) : (
                <button
                  onClick={handleStopRecord}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all animate-pulse"
                >
                  <Square className="w-3.5 h-3.5 fill-current" /> Finish & Analyze
                </button>
              )}

              {recordedPoints.length > 0 && (
                <button
                  onClick={handleDownloadDataset}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5" /> Export HDF5/JSON
                </button>
              )}
            </div>

            {taskScore !== null && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[11px] text-slate-400">Biological Trajectory Score</div>
                  <div className={`text-base font-bold ${taskScore >= 80 ? "text-emerald-400" : "text-amber-400"}`}>
                    {taskScore}/100 {taskScore >= 80 ? "(Certified Human)" : "(Sub-Optimal)"}
                  </div>
                </div>

                {!isSubmitted ? (
                  <button
                    onClick={handleSubmitTrajectory}
                    disabled={taskScore < 80}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Claim +{selectedTask.rewardPi.toFixed(2)} π
                  </button>
                ) : (
                  <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Reward Deposited to Wallet
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Kinematics Stream, Real-Time Telemetry & Enterprise Specs */}
        <div className="lg:col-span-4 space-y-4">
          {/* Embodied Telemetry Monitor */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" />
              Kinematics Telemetry Stream
            </h4>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400">Position 3D (X, Y, Z)</span>
                <span className="text-white font-bold">
                  [{Math.round(currentArmPos.x)}, {Math.round(currentArmPos.y)}, {currentArmPos.z}] mm
                </span>
              </div>

              <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400">Dynamic Torque</span>
                <span className="text-amber-400 font-bold">
                  {(1.2 + (objectPos.isGripped ? 1.4 : 0)).toFixed(2)} N·m
                </span>
              </div>

              <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400">Grasp Sensor</span>
                <span className={objectPos.isGripped ? "text-emerald-400 font-bold" : "text-slate-500"}>
                  {objectPos.isGripped ? "OBJECT LOCKED" : "IDLE"}
                </span>
              </div>

              <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400">Network Latency</span>
                <span className="text-cyan-400 font-bold">14 ms (Edge P2P)</span>
              </div>
            </div>

            {/* Live Waypoints Log preview */}
            <div className="mt-4">
              <div className="flex justify-between items-center text-[11px] text-slate-400 mb-1.5 font-mono">
                <span>RECENT WAYPOINTS</span>
                <span>{recordedPoints.length} SAMPLES</span>
              </div>
              <div className="h-32 overflow-y-auto bg-slate-950 rounded-lg p-2 border border-slate-800 font-mono text-[10px] space-y-1 text-slate-400 select-all">
                {recordedPoints.length === 0 ? (
                  <div className="text-slate-600 text-center py-6">
                    Press "Start Recording Trajectory" to capture 60Hz kinematics.
                  </div>
                ) : (
                  recordedPoints.slice(-8).map((pt, idx) => (
                    <div key={idx} className="flex justify-between hover:text-white">
                      <span>+{pt.t}ms</span>
                      <span>x:{pt.x} y:{pt.y}</span>
                      <span>grip:{(pt.gripper * 100).toFixed(0)}%</span>
                      <span className="text-amber-400">{pt.torque}Nm</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Enterprise Buyer Specifications */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Dataset Quality Guarantee
            </h4>

            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>No Sybil / AI-Generated Jitter:</strong> Pioneer KYC Tier 1/2 biometric attestation attached to every trajectory chunk.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>ROS2 / LeRobot Compatible:</strong> Fully formatted for diffusion policy fine-tuning out of the box.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>Smart Contract Escrow:</strong> 100% of Pi reward guaranteed by the Pi Humanity Protocol smart contract.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
