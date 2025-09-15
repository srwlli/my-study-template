"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginForm } from './login-form'
import { RegisterForm } from './register-form'
import { BookOpen } from 'lucide-react'

export function AuthTabs() {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-3">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">Study App</h1>
        </div>
      </div>

      <Card>
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">Welcome</CardTitle>
          <CardDescription>
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-6">
              <LoginForm />
            </TabsContent>

            <TabsContent value="register" className="mt-6">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}