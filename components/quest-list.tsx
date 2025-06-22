"use client"

import Link from "next/link"
import { Edit, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { deleteQuest } from "@/lib/actions/quest"

interface Quest {
  id: string
  title: string
  description: string
  rewardType: "SBT" | "NFT" | "ETH" | "ERC20"
  rewardAmount: string
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
}

interface QuestListProps {
  quests: Quest[]
}

export function QuestList({ quests }: QuestListProps) {
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this quest?")) {
      const result = await deleteQuest(id)
      if (result.success) {
        toast({
          title: "Success!",
          description: result.message,
        })
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    }
  }

  if (quests.length === 0) {
    return <p className="text-muted-foreground">No quests found. Create one to get started!</p>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {quests.map((quest) => (
        <Card key={quest.id}>
          <CardHeader>
            <CardTitle>{quest.title}</CardTitle>
            <CardDescription className="line-clamp-2">{quest.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Reward: {quest.rewardAmount} {quest.rewardType}
            </div>
            <div className="text-sm text-muted-foreground">Status: {quest.isPublished ? "Published" : "Draft"}</div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/quests/edit/${quest.id}`}>
                <Edit className="mr-2" /> Edit
              </Link>
            </Button>
            <Button variant="destructive" size="sm" onClick={() => handleDelete(quest.id)}>
              <Trash className="mr-2" /> Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
