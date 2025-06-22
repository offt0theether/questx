"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { createQuest, updateQuest } from "@/lib/actions/quest"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  rewardType: z.enum(["SBT", "NFT", "ETH", "ERC20"]),
  rewardAmount: z.string().min(1, {
    message: "Reward amount is required.",
  }),
  isPublished: z.boolean().default(false),
})

type QuestFormValues = z.infer<typeof formSchema>

interface QuestFormProps {
  initialData?: QuestFormValues & { id: string }
}

export function QuestForm({ initialData }: QuestFormProps) {
  const form = useForm<QuestFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      rewardType: "SBT",
      rewardAmount: "",
      isPublished: false,
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset(initialData)
    }
  }, [initialData, form])

  async function onSubmit(values: QuestFormValues) {
    let result
    if (initialData?.id) {
      const formData = new FormData()
      formData.append("title", values.title)
      formData.append("description", values.description)
      formData.append("rewardType", values.rewardType)
      formData.append("rewardAmount", values.rewardAmount)
      formData.append("isPublished", values.isPublished ? "on" : "off")
      result = await updateQuest(initialData.id, formData)
    } else {
      const formData = new FormData()
      formData.append("title", values.title)
      formData.append("description", values.description)
      formData.append("rewardType", values.rewardType)
      formData.append("rewardAmount", values.rewardAmount)
      formData.append("isPublished", values.isPublished ? "on" : "off")
      result = await createQuest(formData)
    }

    if (result.success) {
      toast({
        title: "Success!",
        description: result.message,
      })
      if (!initialData) {
        form.reset() // Clear form after successful creation
      }
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quest Title</FormLabel>
              <FormControl>
                <Input placeholder="Learn about Base" {...field} />
              </FormControl>
              <FormDescription>This is the title of your quest.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quest Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe what the user will learn and do in this quest."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>Provide a detailed description of the quest.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="rewardType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reward Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a reward type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="SBT">Soulbound Token (SBT)</SelectItem>
                    <SelectItem value="NFT">NFT</SelectItem>
                    <SelectItem value="ETH">ETH</SelectItem>
                    <SelectItem value="ERC20">ERC-20 Token</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Choose the type of reward for completing this quest.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rewardAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reward Amount</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 1 (for NFT/SBT), 0.001 (for ETH)" {...field} />
                </FormControl>
                <FormDescription>Specify the amount of the reward.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="isPublished"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Publish Quest</FormLabel>
                <FormDescription>Toggle to make the quest visible to users.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : initialData ? "Update Quest" : "Create Quest"}
        </Button>
      </form>
    </Form>
  )
}
