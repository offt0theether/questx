"use client"

import { ArrowLeft, Play, Lock, CheckCircle, Coins, Clock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useApp } from "../../providers"

const categoryData = {
  "defi-basics": {
    title: "DeFi Fundamentals",
    description: "Master the basics of decentralized finance",
    icon: "💰",
    quests: [
      {
        id: "first-swap",
        title: "Your First Token Swap",
        description: "Learn how to swap tokens on a DEX",
        xp: 50,
        duration: "5 min",
        isLocked: false,
      },
      {
        id: "liquidity-pools",
        title: "Understanding Liquidity Pools",
        description: "Learn how liquidity pools work in DeFi",
        xp: 75,
        duration: "8 min",
        isLocked: false,
      },
      {
        id: "yield-farming",
        title: "Yield Farming Basics",
        description: "Earn rewards by providing liquidity",
        xp: 100,
        duration: "12 min",
        isLocked: true,
      },
      {
        id: "impermanent-loss",
        title: "Understanding Impermanent Loss",
        description: "Learn about the risks of liquidity provision",
        xp: 125,
        duration: "15 min",
        isLocked: true,
      },
      {
        id: "defi-strategies",
        title: "Advanced DeFi Strategies",
        description: "Combine multiple DeFi protocols",
        xp: 150,
        duration: "20 min",
        isLocked: true,
      },
    ],
  },
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { user } = useApp()
  const category = categoryData[params.slug as keyof typeof categoryData]

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Category Not Found</h2>
            <p className="text-gray-600 mb-4">The learning path you're looking for doesn't exist.</p>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const completedQuests =
    user?.completedQuests.filter((q) => category.quests.some((quest) => quest.id === q)).length || 0

  const totalXP = category.quests.reduce((sum, quest) => sum + quest.xp, 0)
  const earnedXP = category.quests
    .filter((quest) => user?.completedQuests.includes(quest.id))
    .reduce((sum, quest) => sum + quest.xp, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{category.icon}</div>
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{category.title}</CardTitle>
                <CardDescription className="text-lg">{category.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {completedQuests}/{category.quests.length}
                </div>
                <div className="text-sm text-gray-600">Quests Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {earnedXP}/{totalXP}
                </div>
                <div className="text-sm text-gray-600">XP Earned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round((completedQuests / category.quests.length) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Progress</div>
              </div>
            </div>

            <div className="mt-6">
              <Progress value={(completedQuests / category.quests.length) * 100} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Quest List */}
        <div className="space-y-4">
          {category.quests.map((quest, index) => {
            const isCompleted = user?.completedQuests.includes(quest.id)
            const isUnlocked =
              !quest.isLocked || index === 0 || user?.completedQuests.includes(category.quests[index - 1]?.id)

            return (
              <Card key={quest.id} className={`transition-all ${isCompleted ? "bg-green-50 border-green-200" : ""}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isCompleted ? "bg-green-500" : isUnlocked ? "bg-blue-500" : "bg-gray-300"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-6 w-6 text-white" />
                        ) : isUnlocked ? (
                          <Play className="h-6 w-6 text-white" />
                        ) : (
                          <Lock className="h-6 w-6 text-gray-500" />
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{quest.title}</h3>
                        <p className="text-gray-600 mb-2">{quest.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Coins className="h-4 w-4 mr-1" />
                            {quest.xp} XP
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {quest.duration}
                          </div>
                          {isCompleted && (
                            <Badge className="bg-green-500">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="ml-4">
                      {isCompleted ? (
                        <Button variant="outline" disabled>
                          Completed
                        </Button>
                      ) : isUnlocked ? (
                        <Link href={`/quest/${quest.id}`}>
                          <Button>Start Quest</Button>
                        </Link>
                      ) : (
                        <Button variant="outline" disabled>
                          <Lock className="h-4 w-4 mr-2" />
                          Locked
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
