import { QuestForm } from "@/components/quest-form"

export default function CreateQuestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Create New Quest</h2>
      <QuestForm />
    </div>
  )
}
