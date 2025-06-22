"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  worldId?: string
  walletAddress?: string
  completedQuests: string[]
  createdQuests: string[]
  totalXP: number
  level: number
  credentials: string[]
  isCreator: boolean
  reputation: number
}

interface Quest {
  id: string
  title: string
  description: string
  category: string
  creatorId: string
  creatorName: string
  xp: number
  duration: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  steps: QuestStep[]
  prize?: Prize
  completions: number
  rating: number
  isPublished: boolean
  createdAt: string
}

interface QuestStep {
  title: string
  content: string
  type: "learn" | "action" | "quiz"
  action?: string
  question?: string
  options?: string[]
  correct?: number
}

interface Prize {
  type: "SBT" | "NFT" | "Token"
  name: string
  description: string
  imageUrl?: string
  contractAddress?: string
  amount?: number
}

interface AppContextType {
  user: User | null
  quests: Quest[]
  isConnected: boolean
  connectWallet: () => Promise<void>
  verifyWorldId: () => Promise<void>
  completeQuest: (questId: string, xp: number) => void
  mintCredential: (questId: string) => Promise<void>
  createQuest: (quest: Omit<Quest, "id" | "creatorId" | "creatorName" | "completions" | "rating" | "createdAt">) => void
  publishQuest: (questId: string) => void
  claimPrize: (questId: string) => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

// Sample quests data
const initialQuests: Quest[] = [
  {
    id: "first-swap",
    title: "Your First Token Swap",
    description: "Learn how to swap tokens on a decentralized exchange",
    category: "DeFi Fundamentals",
    creatorId: "system",
    creatorName: "Quest Team",
    xp: 50,
    duration: "5 min",
    difficulty: "Beginner",
    completions: 1247,
    rating: 4.8,
    isPublished: true,
    createdAt: "2024-01-01",
    steps: [
      {
        title: "What is a DEX?",
        content:
          "A Decentralized Exchange (DEX) is a peer-to-peer marketplace where cryptocurrency traders make transactions directly without intermediaries.",
        type: "learn",
      },
      {
        title: "Connect Your Wallet",
        content: "To interact with a DEX, you need to connect your crypto wallet.",
        type: "action",
        action: "connect_wallet",
      },
      {
        title: "Execute the Swap",
        content: "Click 'Swap' and confirm the transaction in your wallet.",
        type: "action",
        action: "simulate_swap",
      },
    ],
    prize: {
      type: "SBT",
      name: "DeFi Pioneer",
      description: "Soulbound token proving you completed your first swap",
      imageUrl: "/sbt-defi-pioneer.png",
    },
  },
  {
    id: "wallet-security",
    title: "Wallet Security Basics",
    description: "Learn essential practices to keep your crypto assets safe",
    category: "Security",
    creatorId: "system",
    creatorName: "Quest Team",
    xp: 75,
    duration: "8 min",
    difficulty: "Beginner",
    completions: 892,
    rating: 4.9,
    isPublished: true,
    createdAt: "2024-01-02",
    steps: [
      {
        title: "Seed Phrase Security",
        content: "Your seed phrase is the master key to your wallet. Never share it online.",
        type: "learn",
      },
      {
        title: "Security Quiz",
        content: "Test your knowledge about wallet security.",
        type: "quiz",
        question: "What should you do if someone asks for your seed phrase?",
        options: ["Share it if they seem trustworthy", "Never share it with anyone", "Only share the first few words"],
        correct: 1,
      },
    ],
    prize: {
      type: "NFT",
      name: "Security Guardian",
      description: "NFT certificate for mastering wallet security",
      imageUrl: "/nft-security-guardian.png",
    },
  },
]

export function Providers({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [quests, setQuests] = useState<Quest[]>(initialQuests)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem("quest-user")
    const savedQuests = localStorage.getItem("quest-quests")

    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setIsConnected(true)
    }

    if (savedQuests) {
      setQuests(JSON.parse(savedQuests))
    }
  }, [])

  const connectWallet = async () => {
    try {
      const newUser: User = {
        id: `user_${Date.now()}`,
        walletAddress: "0x1234...5678",
        completedQuests: [],
        createdQuests: [],
        totalXP: 0,
        level: 1,
        credentials: [],
        isCreator: false,
        reputation: 0,
      }

      setUser(newUser)
      setIsConnected(true)
      localStorage.setItem("quest-user", JSON.stringify(newUser))
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }
  }

  const verifyWorldId = async () => {
    try {
      if (user) {
        const updatedUser = {
          ...user,
          worldId: "world_id_verified",
          isCreator: true, // Enable quest creation after World ID verification
        }
        setUser(updatedUser)
        localStorage.setItem("quest-user", JSON.stringify(updatedUser))
      }
    } catch (error) {
      console.error("World ID verification failed:", error)
    }
  }

  const completeQuest = (questId: string, xp: number) => {
    if (user && !user.completedQuests.includes(questId)) {
      const newXP = user.totalXP + xp
      const newLevel = Math.floor(newXP / 100) + 1

      const updatedUser = {
        ...user,
        completedQuests: [...user.completedQuests, questId],
        totalXP: newXP,
        level: newLevel,
      }

      // Update quest completion count
      const updatedQuests = quests.map((quest) =>
        quest.id === questId ? { ...quest, completions: quest.completions + 1 } : quest,
      )

      setUser(updatedUser)
      setQuests(updatedQuests)
      localStorage.setItem("quest-user", JSON.stringify(updatedUser))
      localStorage.setItem("quest-quests", JSON.stringify(updatedQuests))
    }
  }

  const mintCredential = async (questId: string) => {
    if (user) {
      const credentialId = `credential_${questId}_${Date.now()}`
      const updatedUser = {
        ...user,
        credentials: [...user.credentials, credentialId],
      }

      setUser(updatedUser)
      localStorage.setItem("quest-user", JSON.stringify(updatedUser))
    }
  }

  const createQuest = (
    questData: Omit<Quest, "id" | "creatorId" | "creatorName" | "completions" | "rating" | "createdAt">,
  ) => {
    if (user && user.isCreator) {
      const newQuest: Quest = {
        ...questData,
        id: `quest_${Date.now()}`,
        creatorId: user.id,
        creatorName: user.walletAddress?.slice(0, 6) + "..." + user.walletAddress?.slice(-4) || "Anonymous",
        completions: 0,
        rating: 0,
        createdAt: new Date().toISOString(),
      }

      const updatedQuests = [...quests, newQuest]
      const updatedUser = {
        ...user,
        createdQuests: [...user.createdQuests, newQuest.id],
        reputation: user.reputation + 10, // Reward for creating content
      }

      setQuests(updatedQuests)
      setUser(updatedUser)
      localStorage.setItem("quest-quests", JSON.stringify(updatedQuests))
      localStorage.setItem("quest-user", JSON.stringify(updatedUser))
    }
  }

  const publishQuest = (questId: string) => {
    const updatedQuests = quests.map((quest) => (quest.id === questId ? { ...quest, isPublished: true } : quest))
    setQuests(updatedQuests)
    localStorage.setItem("quest-quests", JSON.stringify(updatedQuests))
  }

  const claimPrize = async (questId: string) => {
    // Simulate claiming SBT/NFT prize
    if (user) {
      const quest = quests.find((q) => q.id === questId)
      if (quest?.prize) {
        const prizeId = `prize_${questId}_${Date.now()}`
        const updatedUser = {
          ...user,
          credentials: [...user.credentials, prizeId],
        }
        setUser(updatedUser)
        localStorage.setItem("quest-user", JSON.stringify(updatedUser))
      }
    }
  }

  return (
    <AppContext.Provider
      value={{
        user,
        quests,
        isConnected,
        connectWallet,
        verifyWorldId,
        completeQuest,
        mintCredential,
        createQuest,
        publishQuest,
        claimPrize,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within a Providers")
  }
  return context
}
