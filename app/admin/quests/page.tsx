import Link from "next/link"

import { Button } from "@/components/ui/button"
import { QuestList } from "@/components/quest-list"
import { getQuests } from "@/lib/actions/quest"

export default async function AdminQuestsPage() {
  const quests = await getQuests()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Quests</h2>
        <Button asChild>
          <Link href="/admin/quests/create">Create New Quest</Link>
        </Button>
      </div>
      <QuestList quests={quests} />
    </div>
  )
}
