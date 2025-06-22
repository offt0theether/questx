"use client"

import { ArrowLeft, Clock, User, BookOpen, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

// This would typically come from a database or CMS
const tutorialData = {
  title: "React Hooks in 5 Minutes",
  description: "Learn the fundamentals of React Hooks and how to use useState and useEffect in your components.",
  difficulty: "Beginner",
  readTime: "5 min",
  author: "Sarah Chen",
  category: "Web Development",
  lastUpdated: "2024-01-15",
  content: [
    {
      type: "text",
      content:
        "React Hooks revolutionized how we write React components by allowing us to use state and lifecycle methods in functional components.",
    },
    {
      type: "heading",
      content: "What are React Hooks?",
    },
    {
      type: "text",
      content:
        "Hooks are functions that let you 'hook into' React state and lifecycle features from function components. They were introduced in React 16.8.",
    },
    {
      type: "code",
      language: "javascript",
      content: `import React, { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}`,
    },
    {
      type: "heading",
      content: "Key Rules of Hooks",
    },
    {
      type: "list",
      items: [
        "Only call Hooks at the top level of your React function",
        "Don't call Hooks inside loops, conditions, or nested functions",
        "Only call Hooks from React function components or custom Hooks",
      ],
    },
    {
      type: "text",
      content:
        "That's it! You now understand the basics of React Hooks. Practice by converting a class component to use hooks.",
    },
  ],
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Beginner":
      return "bg-green-100 text-green-800"
    case "Intermediate":
      return "bg-yellow-100 text-yellow-800"
    case "Advanced":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function TutorialPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to tutorials
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tutorial Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Badge variant="outline">{tutorialData.category}</Badge>
            <Badge className={getDifficultyColor(tutorialData.difficulty)}>{tutorialData.difficulty}</Badge>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{tutorialData.title}</h1>

          <p className="text-xl text-gray-600 mb-6">{tutorialData.description}</p>

          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {tutorialData.readTime}
            </div>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              {tutorialData.author}
            </div>
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-1" />
              Updated {new Date(tutorialData.lastUpdated).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-8">
                <div className="prose prose-lg max-w-none">
                  {tutorialData.content.map((section, index) => {
                    switch (section.type) {
                      case "heading":
                        return (
                          <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                            {section.content}
                          </h2>
                        )
                      case "text":
                        return (
                          <p key={index} className="text-gray-700 mb-6 leading-relaxed">
                            {section.content}
                          </p>
                        )
                      case "code":
                        return (
                          <div key={index} className="mb-6">
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                              <code>{section.content}</code>
                            </pre>
                          </div>
                        )
                      case "list":
                        return (
                          <ul key={index} className="mb-6 space-y-2">
                            {section.items?.map((item, itemIndex) => (
                              <li key={itemIndex} className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                        )
                      default:
                        return null
                    }
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Save Tutorial
                  </Button>
                  <Button className="w-full" variant="outline">
                    Share
                  </Button>
                </div>

                <div className="mt-8">
                  <h4 className="font-semibold text-gray-900 mb-4">Related Tutorials</h4>
                  <div className="space-y-3">
                    <Link href="#" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <h5 className="font-medium text-sm text-gray-900">CSS Grid Layout Basics</h5>
                      <p className="text-xs text-gray-500 mt-1">7 min read</p>
                    </Link>
                    <Link href="#" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <h5 className="font-medium text-sm text-gray-900">API Integration with Fetch</h5>
                      <p className="text-xs text-gray-500 mt-1">10 min read</p>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
