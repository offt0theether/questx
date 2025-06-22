"use server"

import { revalidatePath } from "next/cache"

// Define a simple in-memory store for quests
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

let quests: Quest[] = [] // In-memory array to store quests

export async function createQuest(formData: FormData) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const rewardType = formData.get("rewardType") as Quest["rewardType"]
  const rewardAmount = formData.get("rewardAmount") as string
  const isPublished = formData.get("isPublished") === "on"

  if (!title || !description || !rewardType || !rewardAmount) {
    return { success: false, message: "All fields are required." }
  }

  const newQuest: Quest = {
    id: `quest-${Date.now()}`, // Simple unique ID
    title,
    description,
    rewardType,
    rewardAmount,
    isPublished,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  quests.push(newQuest)
  revalidatePath("/admin/quests")
  return { success: true, message: "Quest created successfully!" }
}

export async function getQuests(): Promise<Quest[]> {
  // In a real application, you would fetch from a database
  return quests.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export async function getQuestById(id: string): Promise<Quest | undefined> {
  return quests.find((quest) => quest.id === id)
}

export async function updateQuest(id: string, formData: FormData) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const rewardType = formData.get("rewardType") as Quest["rewardType"]
  const rewardAmount = formData.get("rewardAmount") as string
  const isPublished = formData.get("isPublished") === "on"

  const questIndex = quests.findIndex((q) => q.id === id)

  if (questIndex === -1) {
    return { success: false, message: "Quest not found." }
  }

  quests[questIndex] = {
    ...quests[questIndex],
    title,
    description,
    rewardType,
    rewardAmount,
    isPublished,
    updatedAt: new Date(),
  }
  revalidatePath("/admin/quests")
  revalidatePath(`/admin/quests/edit/${id}`)
  return { success: true, message: "Quest updated successfully!" }
}

export async function deleteQuest(id: string) {
  const initialLength = quests.length
  quests = quests.filter((quest) => quest.id !== id)
  if (quests.length < initialLength) {
    revalidatePath("/admin/quests")
    return { success: true, message: "Quest deleted successfully!" }
  }
  return { success: false, message: "Quest not found." }
}
