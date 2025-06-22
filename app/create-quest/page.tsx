"use client"

import { useState } from "react"
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useApp } from "../providers"
import { useRouter } from "next/navigation"

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

export default function CreateQuestPage() {
  const { user, createQuest } = useApp()
  const router = useRouter()

  const [questData, setQuestData] = useState({
    title: "",
    description: "",
    category: "",
    xp: 50,
    duration: "5 min",
    difficulty: "Beginner" as "Beginner" | "Intermediate" | "Advanced",
    isPublished: false,
  })

  const [steps, setSteps] = useState<QuestStep[]>([
    {
      title: "",
      content: "",
      type: "learn",
    },
  ])

  const [prize, setPrize] = useState<Prize>({
    type: "SBT",
    name: "",
    description: "",
  })

  const [hasPrize, setHasPrize] = useState(false)

  if (!user?.isCreator) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
            <p className="text-gray-600 mb-4">You need to verify with World ID to create quests.</p>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const addStep = () => {
    setSteps([...steps, { title: "", content: "", type: "learn" }])
  }

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index))
    }
  }

  const updateStep = (index: number, field: keyof QuestStep, value: any) => {
    const updatedSteps = steps.map((step, i) => (i === index ? { ...step, [field]: value } : step))
    setSteps(updatedSteps)
  }

  const handleSubmit = () => {
    if (!questData.title || !questData.description || steps.some((s) => !s.title || !s.content)) {
      alert("Please fill in all required fields")
      return
    }

    const newQuest = {
      ...questData,
      steps,
      prize: hasPrize ? prize : undefined,
    }

    createQuest(newQuest)
    router.push("/")
  }

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
            <h1 className="text-lg font-bold">Create Quest</h1>
            <Button onClick={handleSubmit} size="sm" className="world-gradient">
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Basic Info */}
        <Card className="world-card">
          <CardHeader>
            <CardTitle className="text-lg">Quest Details</CardTitle>
            <CardDescription>Basic information about your quest</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-sm font-medium">
                Title *
              </Label>
              <Input
                id="title"
                placeholder="Enter quest title"
                value={questData.title}
                onChange={(e) => setQuestData({ ...questData, title: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium">
                Description *
              </Label>
              <Textarea
                id="description"
                placeholder="Describe what learners will achieve"
                value={questData.description}
                onChange={(e) => setQuestData({ ...questData, description: e.target.value })}
                className="mt-1 min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Category</Label>
                <Select
                  value={questData.category}
                  onValueChange={(value) => setQuestData({ ...questData, category: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DeFi Fundamentals">DeFi Fundamentals</SelectItem>
                    <SelectItem value="NFT Ecosystem">NFT Ecosystem</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                    <SelectItem value="DAO Governance">DAO Governance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Difficulty</Label>
                <Select
                  value={questData.difficulty}
                  onValueChange={(value: any) => setQuestData({ ...questData, difficulty: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="xp" className="text-sm font-medium">
                  XP Reward
                </Label>
                <Input
                  id="xp"
                  type="number"
                  min="10"
                  max="500"
                  value={questData.xp}
                  onChange={(e) => setQuestData({ ...questData, xp: Number.parseInt(e.target.value) })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="duration" className="text-sm font-medium">
                  Duration
                </Label>
                <Input
                  id="duration"
                  placeholder="e.g., 5 min"
                  value={questData.duration}
                  onChange={(e) => setQuestData({ ...questData, duration: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quest Steps */}
        <Card className="world-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Quest Steps</CardTitle>
                <CardDescription>Create the learning journey</CardDescription>
              </div>
              <Button onClick={addStep} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add Step
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {steps.map((step, index) => (
              <Card key={index} className="border border-gray-200">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Step {index + 1}</Badge>
                    {steps.length > 1 && (
                      <Button
                        onClick={() => removeStep(index)}
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Step Title *</Label>
                    <Input
                      placeholder="Enter step title"
                      value={step.title}
                      onChange={(e) => updateStep(index, "title", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Content *</Label>
                    <Textarea
                      placeholder="Explain this step"
                      value={step.content}
                      onChange={(e) => updateStep(index, "content", e.target.value)}
                      className="mt-1 min-h-[60px]"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Step Type</Label>
                    <Select value={step.type} onValueChange={(value: any) => updateStep(index, "type", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="learn">Learn</SelectItem>
                        <SelectItem value="action">Action</SelectItem>
                        <SelectItem value="quiz">Quiz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {step.type === "quiz" && (
                    <div className="space-y-3 pt-2 border-t">
                      <div>
                        <Label className="text-sm font-medium">Question</Label>
                        <Input
                          placeholder="Enter quiz question"
                          value={step.question || ""}
                          onChange={(e) => updateStep(index, "question", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Options (one per line)</Label>
                        <Textarea
                          placeholder="Option 1&#10;Option 2&#10;Option 3"
                          value={step.options?.join("\n") || ""}
                          onChange={(e) => updateStep(index, "options", e.target.value.split("\n"))}
                          className="mt-1 min-h-[60px]"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Correct Answer (0-based index)</Label>
                        <Input
                          type="number"
                          min="0"
                          placeholder="0"
                          value={step.correct || 0}
                          onChange={(e) => updateStep(index, "correct", Number.parseInt(e.target.value))}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}

                  {step.type === "action" && (
                    <div className="pt-2 border-t">
                      <Label className="text-sm font-medium">Action Type</Label>
                      <Input
                        placeholder="e.g., connect_wallet, simulate_swap"
                        value={step.action || ""}
                        onChange={(e) => updateStep(index, "action", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Prize Configuration */}
        <Card className="world-card">
          <CardHeader>
            <CardTitle className="text-lg">Quest Prize</CardTitle>
            <CardDescription>Optional reward for quest completion</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="has-prize" checked={hasPrize} onCheckedChange={setHasPrize} />
              <Label htmlFor="has-prize" className="text-sm">
                Add completion prize
              </Label>
            </div>

            {hasPrize && (
              <div className="space-y-4 pt-4 border-t">
                <div>
                  <Label className="text-sm font-medium">Prize Type</Label>
                  <Select value={prize.type} onValueChange={(value: any) => setPrize({ ...prize, type: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SBT">Soulbound Token (SBT)</SelectItem>
                      <SelectItem value="NFT">NFT Certificate</SelectItem>
                      <SelectItem value="Token">Token Reward</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Prize Name</Label>
                  <Input
                    placeholder="e.g., DeFi Pioneer Badge"
                    value={prize.name}
                    onChange={(e) => setPrize({ ...prize, name: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Prize Description</Label>
                  <Textarea
                    placeholder="Describe the prize"
                    value={prize.description}
                    onChange={(e) => setPrize({ ...prize, description: e.target.value })}
                    className="mt-1 min-h-[60px]"
                  />
                </div>

                {prize.type === "Token" && (
                  <div>
                    <Label className="text-sm font-medium">Token Amount</Label>
                    <Input
                      type="number"
                      placeholder="100"
                      value={prize.amount || ""}
                      onChange={(e) => setPrize({ ...prize, amount: Number.parseInt(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="pb-6">
          <Button onClick={handleSubmit} className="w-full h-12 world-gradient text-base font-medium">
            <Save className="h-5 w-5 mr-2" />
            Create Quest
          </Button>
        </div>
      </div>
    </div>
  )
}
