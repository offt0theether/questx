"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Play, CheckCircle, Trophy, Coins, Clock, Star, Gift } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useApp } from "../../providers"
import { useRouter } from "next/navigation"

export default function QuestPage({ params }: { params: { id: string } }) {
  const { user, quests, completeQuest, claimPrize } = useApp()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const quest = quests.find((q) => q.id === params.id)

  useEffect(() => {
    if (user?.completedQuests.includes(params.id)) {
      setIsCompleted(true)
    }
  }, [user, params.id])

  if (!quest) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="world-card">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Quest Not Found</h2>
            <p className="text-gray-600 mb-4">The quest you're looking for doesn't exist.</p>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleStepComplete = () => {
    if (currentStep < quest.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeQuest(params.id, quest.xp)
      setIsCompleted(true)
      setShowSuccess(true)
    }
  }

  const handleClaimPrize = async () => {
    await claimPrize(params.id)
    setShowSuccess(false)
    router.push("/")
  }

  const currentStepData = quest.steps[currentStep]
  const progress = ((currentStep + 1) / quest.steps.length) * 100

  return (
    <div className="min-h-screen bg-gray-50 mobile-safe">
      {/* Mobile Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-blue-600">
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="font-medium">Back</span>
            </Link>
            <div className="text-center">
              <div className="text-sm font-medium">
                Step {currentStep + 1}/{quest.steps.length}
              </div>
            </div>
            <div className="w-16"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Quest Header - Mobile Optimized */}
        <Card className="world-card">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-12 h-12 world-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-bold mb-1 line-clamp-2">{quest.title}</h1>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{quest.description}</p>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {quest.category}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {quest.difficulty}
                  </Badge>
                  {isCompleted && (
                    <Badge className="bg-green-500 text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Done
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center">
                <Coins className="h-4 w-4 mr-1" />
                {quest.xp} XP
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {quest.duration}
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1" />
                {quest.rating || "New"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prize Preview */}
        {quest.prize && (
          <Card className="world-card border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Gift className="h-8 w-8 text-purple-600 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-purple-900 text-sm">Quest Prize</h3>
                  <p className="text-xs text-purple-700">{quest.prize.name}</p>
                  <Badge variant="outline" className="text-xs mt-1 border-purple-300">
                    {quest.prize.type}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress Bar */}
        <Card className="world-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Current Step */}
        <Card className="world-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <div className="w-8 h-8 world-gradient text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                {currentStep + 1}
              </div>
              {currentStepData.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed">{currentStepData.content}</p>
            </div>

            {currentStepData.type === "quiz" && (
              <div className="space-y-3 mb-6">
                <h4 className="font-medium text-sm">{currentStepData.question}</h4>
                <div className="space-y-2">
                  {currentStepData.options?.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-3 px-4"
                      onClick={() => {
                        if (index === currentStepData.correct) {
                          handleStepComplete()
                        }
                      }}
                    >
                      <span className="text-sm">{option}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {currentStepData.type === "action" && (
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h4 className="font-medium text-blue-900 text-sm mb-2">Interactive Action</h4>
                <p className="text-blue-700 text-sm mb-3">
                  {currentStepData.action === "connect_wallet"
                    ? "Simulate connecting your wallet to a DEX"
                    : "Simulate executing a token swap"}
                </p>
                <Button onClick={handleStepComplete} className="world-gradient w-full">
                  <Play className="h-4 w-4 mr-2" />
                  {currentStepData.action === "connect_wallet" ? "Connect Wallet" : "Execute Action"}
                </Button>
              </div>
            )}

            {currentStepData.type === "learn" && (
              <Button onClick={handleStepComplete} className="w-full h-12 world-gradient">
                {currentStep === quest.steps.length - 1 ? "Complete Quest" : "Continue"}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Success Modal */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-sm world-card">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 world-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Quest Completed!</h3>
                <p className="text-gray-600 text-sm mb-4">
                  You've earned {quest.xp} XP{quest.prize && " and unlocked a special prize!"}
                </p>

                {quest.prize && (
                  <div className="bg-purple-50 p-3 rounded-lg mb-4">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Gift className="h-5 w-5 text-purple-600" />
                      <span className="font-medium text-purple-900 text-sm">{quest.prize.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs border-purple-300">
                      {quest.prize.type}
                    </Badge>
                  </div>
                )}

                <div className="space-y-3">
                  {quest.prize && (
                    <Button onClick={handleClaimPrize} className="w-full world-gradient">
                      <Gift className="h-4 w-4 mr-2" />
                      Claim Prize
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => router.push("/")} className="w-full">
                    Continue Learning
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
