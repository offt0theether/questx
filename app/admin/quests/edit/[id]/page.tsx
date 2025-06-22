import { notFound } from "next/navigation"

import { QuestForm } from "@/components/quest-form"
import { getQuestById } from "@/lib/actions/quest"

export default async function EditQuestPage({ params }: { params: { id: string } }) {
  const quest = await getQuestById(params.id)

  if (!quest) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Edit Quest: {quest.title}</h2>
      <QuestForm initialData={quest} />
    </div>
  )
}
