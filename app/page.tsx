"use client"

import { useState } from "react"
import { Wallet, Shield, Trophy, Star, Play, Plus, Users, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useApp } from "./providers"
import Link from "next/link"

export default function HomePage() {
  const { user, quests, isConnected, connectWallet, verifyWorldId } = useApp()
  const [activeTab, setActiveTab] = useState("discover")

  const publishedQuests = quests.filter((q) => q.isPublished)
  const myCreatedQuests = user ? quests.filter((q) => q.creatorId === user.id) : []

  if (!isConnected) {
    return (
      <div className="min-h-screen world-gradient flex items-center justify-center p-4 mobile-safe">
        <Card className="w-full max-w-sm world-card">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-20 h-20 world-gradient rounded-full flex items-center justify-center mb-4">
              <Trophy className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to Quest
            </CardTitle>
            <CardDescription className="text-base">
              Learn blockchain through interactive quests and earn verifiable credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <Button onClick={connectWallet} className="w-full h-12 text-base font-medium world-gradient" size="lg">
              <Wallet className="h-5 w-5 mr-2" />
              Connect Wallet
            </Button>
            <p className="text-center text-sm text-gray-600">Connect your wallet to start your learning journey</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 mobile-safe">
      {/* Mobile Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 world-gradient rounded-lg flex items-center justify-center">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold">Quest</h1>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm font-medium">Lv.{user?.level}</div>
                <div className="text-xs text-gray-500">{user?.totalXP} XP</div>
              </div>
              <div className="w-10 h-10 world-gradient rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">{user?.walletAddress?.slice(2, 4).toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Tabs */}
      <div className="px-4 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="discover" className="text-sm">
              Discover
            </TabsTrigger>
            <TabsTrigger value="create" className="text-sm">
              Create
            </TabsTrigger>
            <TabsTrigger value="profile" className="text-sm">
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="space-y-6">
            {/* User Stats - Mobile Optimized */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="world-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600">Total XP</p>
                      <p className="text-xl font-bold text-blue-600">{user?.totalXP}</p>
                    </div>
                    <Star className="h-6 w-6 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="world-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600">Completed</p>
                      <p className="text-xl font-bold text-green-600">{user?.completedQuests.length}</p>
                    </div>
                    <Trophy className="h-6 w-6 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* World ID Verification */}
            {!user?.worldId && (
              <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-8 w-8 text-blue-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-blue-900 text-sm">Verify with World ID</h3>
                      <p className="text-xs text-blue-700">Unlock quest creation & earn bonus XP</p>
                    </div>
                    <Button onClick={verifyWorldId} size="sm" className="world-gradient text-xs px-3">
                      Verify
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Featured Quests - Mobile Optimized */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Featured Quests</h2>
              <div className="space-y-3">
                {publishedQuests.slice(0, 3).map((quest) => (
                  <Card key={quest.id} className="world-card">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 world-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                          <Play className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm mb-1 line-clamp-1">{quest.title}</h3>
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{quest.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                                {quest.xp} XP
                              </Badge>
                              <span className="text-xs text-gray-500">{quest.duration}</span>
                            </div>
                            <Link href={`/quest/${quest.id}`}>
                              <Button size="sm" className="h-7 px-3 text-xs">
                                Start
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Categories - Mobile Grid */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Categories</h2>
              <div className="grid grid-cols-2 gap-3">
                {["DeFi", "NFTs", "Security", "DAOs"].map((category) => (
                  <Card key={category} className="world-card">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">
                        {category === "DeFi" && "💰"}
                        {category === "NFTs" && "🎨"}
                        {category === "Security" && "🛡️"}
                        {category === "DAOs" && "🏛️"}
                      </div>
                      <h3 className="font-semibold text-sm mb-1">{category}</h3>
                      <p className="text-xs text-gray-600">
                        {publishedQuests.filter((q) => q.category.includes(category)).length} quests
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            {user?.isCreator ? (
              <>
                <div className="text-center py-6">
                  <div className="w-16 h-16 world-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Create Your Quest</h2>
                  <p className="text-gray-600 text-sm mb-6">
                    Share your knowledge and earn reputation by creating educational quests
                  </p>
                  <Link href="/create-quest">
                    <Button className="world-gradient h-12 px-8">
                      <Plus className="h-5 w-5 mr-2" />
                      Create New Quest
                    </Button>
                  </Link>
                </div>

                {/* My Created Quests */}
                {myCreatedQuests.length > 0 && (
                  <section>
                    <h3 className="text-lg font-bold mb-4">My Quests</h3>
                    <div className="space-y-3">
                      {myCreatedQuests.map((quest) => (
                        <Card key={quest.id} className="world-card">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm mb-1">{quest.title}</h4>
                                <div className="flex items-center space-x-3 text-xs text-gray-600">
                                  <div className="flex items-center">
                                    <Users className="h-3 w-3 mr-1" />
                                    {quest.completions}
                                  </div>
                                  <div className="flex items-center">
                                    <Star className="h-3 w-3 mr-1" />
                                    {quest.rating || "New"}
                                  </div>
                                </div>
                              </div>
                              <Badge variant={quest.isPublished ? "default" : "secondary"} className="text-xs">
                                {quest.isPublished ? "Published" : "Draft"}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </section>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Verify with World ID</h3>
                <p className="text-gray-600 text-sm mb-6">
                  Complete World ID verification to unlock quest creation and start earning from your content
                </p>
                <Button onClick={verifyWorldId} className="world-gradient">
                  <Shield className="h-4 w-4 mr-2" />
                  Verify Now
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <div className="text-center py-6">
              <div className="w-20 h-20 world-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-white">{user?.walletAddress?.slice(2, 4).toUpperCase()}</span>
              </div>
              <h2 className="text-xl font-bold mb-1">Level {user?.level}</h2>
              <p className="text-gray-600 text-sm">{user?.totalXP} XP</p>
            </div>

            {/* Profile Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="world-card">
                <CardContent className="p-4 text-center">
                  <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-lg font-bold">{user?.completedQuests.length}</p>
                  <p className="text-xs text-gray-600">Quests Completed</p>
                </CardContent>
              </Card>

              <Card className="world-card">
                <CardContent className="p-4 text-center">
                  <Award className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-lg font-bold">{user?.credentials.length}</p>
                  <p className="text-xs text-gray-600">Credentials Earned</p>
                </CardContent>
              </Card>
            </div>

            {/* Achievements */}
            <section>
              <h3 className="text-lg font-bold mb-4">Recent Achievements</h3>
              <div className="space-y-3">
                {user?.credentials.slice(0, 3).map((credential, index) => (
                  <Card key={credential} className="world-card">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                          <Award className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">Achievement #{index + 1}</h4>
                          <p className="text-xs text-gray-600">Earned credential</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
