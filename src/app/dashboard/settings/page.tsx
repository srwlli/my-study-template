'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import {
  Palette,
  LogOut,
  Bell,
  Shield,
  User,
  Globe
} from 'lucide-react'

export default function SettingsPage() {
  const { signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/auth')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Theme & Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ThemeToggle />
            <div className="flex items-center justify-between">
              <Label htmlFor="compact-mode" className="text-sm font-medium">
                Compact View
              </Label>
              <input type="checkbox" id="compact-mode" className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="animations" className="text-sm font-medium">
                Enable Animations
              </Label>
              <input type="checkbox" id="animations" defaultChecked className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="study-reminders" className="text-sm font-medium">
                Study Reminders
              </Label>
              <input type="checkbox" id="study-reminders" defaultChecked className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications" className="text-sm font-medium">
                Email Notifications
              </Label>
              <input type="checkbox" id="email-notifications" className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="progress-updates" className="text-sm font-medium">
                Progress Updates
              </Label>
              <input type="checkbox" id="progress-updates" defaultChecked className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <User className="h-5 w-5" />
              Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <User className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Shield className="mr-2 h-4 w-4" />
              Privacy Settings
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Globe className="mr-2 h-4 w-4" />
              Language & Region
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <LogOut className="h-5 w-5" />
              Account Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Sign out of your account or manage your session.
            </p>
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}