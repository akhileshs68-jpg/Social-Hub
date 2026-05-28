"use client"

<<<<<<< HEAD
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
=======
<<<<<<< HEAD
import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
import { Settings, MapPin, Calendar, LinkIcon, LogOut, Coins, CheckCircle2, Crown } from "lucide-react"
import { PostCard } from "@/components/post-card"
import type { Post } from "@/lib/types"
import { usePiAuth } from "@/contexts/pi-auth-context"
import { useSHUBToken } from "@/contexts/shub-token-context"
<<<<<<< HEAD
import { useToast } from "@/hooks/use-toast"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { validateImageFile } from "@/lib/media-utils"
=======
=======
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, MapPin, Calendar, LinkIcon, LogOut, Crown } from "lucide-react"
import { PostCard } from "@/components/post-card"
import type { Post } from "@/lib/types"
import { usePiAuth } from "@/contexts/pi-auth-context"
import { piPaymentService } from "@/lib/pi-payment-service"
>>>>>>> 82bc3ca8b44839ba49ec0fc525fcb6c408caf7eb
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046

interface ProfileProps {
  username: string
  userId: string
}

const USER_POSTS: Post[] = [
  {
    id: "5",
    username: "You",
    avatar: "Y",
    timeAgo: "1d ago",
    content: "Excited to be part of the Pi Network community! Looking forward to connecting with fellow Pioneers.",
    likes: 24,
    comments: 5,
    shares: 2,
    isLiked: false,
  },
]

export function Profile({ username, userId }: ProfileProps) {
<<<<<<< HEAD
  const { userProfile, updateUserProfile, logout } = usePiAuth()
  const { tokens, isReady: tokensReady } = useSHUBToken()
  const { toast } = useToast()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [profileForm, setProfileForm] = useState({
    displayName: "",
    bio: "",
    location: "",
    website: "",
  })
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null)
  const [profilePhotoPreview, setProfilePhotoPreview] = useState("")
  const [savingProfile, setSavingProfile] = useState(false)
=======
  const { userProfile, logout } = usePiAuth()
<<<<<<< HEAD
  const { tokens, isReady: tokensReady } = useSHUBToken()
=======
  const [isPremium, setIsPremium] = useState(false)

  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (userProfile?.id) {
        const subscription = await piPaymentService.getUserSubscription(userProfile.id)
        setIsPremium(piPaymentService.isPremiumActive(subscription))
      }
    }
    checkPremiumStatus()
  }, [userProfile])
>>>>>>> 82bc3ca8b44839ba49ec0fc525fcb6c408caf7eb
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046

  const displayUsername = userProfile?.username || username
  const displayBio =
    userProfile?.bio || "Pi Network Pioneer | Blockchain enthusiast | Building the future of social media"
  const displayFollowers = userProfile?.followers || 0
  const displayFollowing = userProfile?.following || 0
  const displayLocation = userProfile?.location || "Worldwide"
  const displayWebsite = userProfile?.website || "pi-network.com"
  const displayJoinedDate = userProfile?.joinedDate
    ? new Date(userProfile.joinedDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "January 2024"

<<<<<<< HEAD
  const openSettings = () => {
    setProfileForm({
      displayName: userProfile?.displayName || displayUsername,
      bio: displayBio,
      location: displayLocation,
      website: displayWebsite,
    })
    setProfilePhotoPreview(userProfile?.photoURL || "")
    setProfilePhotoFile(null)
    setSettingsOpen(true)
  }

  const handleProfilePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const validation = validateImageFile(file)
    if (!validation.valid) {
      toast({
        title: "Invalid Image",
        description: validation.error,
        variant: "destructive",
      })
      return
    }

    if (profilePhotoPreview && profilePhotoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(profilePhotoPreview)
    }

    setProfilePhotoFile(file)
    setProfilePhotoPreview(URL.createObjectURL(file))
  }

  const saveProfileSettings = async () => {
    if (!userProfile) return

    setSavingProfile(true)
    const displayName = profileForm.displayName.trim() || displayUsername

    try {
      const uploadedPhoto = profilePhotoFile ? await uploadToCloudinary(profilePhotoFile, "profiles") : null
      const photoURL = uploadedPhoto?.secureUrl || userProfile.photoURL

      await updateUserProfile({
        displayName,
        username: displayName,
        avatar: displayName[0]?.toUpperCase() || "P",
        photoURL,
        photoCloudinaryPublicId: uploadedPhoto?.publicId || userProfile.photoCloudinaryPublicId,
        bio: profileForm.bio.trim(),
        location: profileForm.location.trim(),
        website: profileForm.website.trim(),
      })

      setSettingsOpen(false)
      toast({
        title: "Profile updated",
        description: "Your profile settings have been saved.",
      })
    } catch (error) {
      console.error("[socialhub] Failed to update profile:", error)
      toast({
        title: "Profile update failed",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setSavingProfile(false)
    }
  }

=======
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
  return (
    <div>
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/10" />

        <div className="px-4 pb-4">
          <div className="flex items-end justify-between -mt-12 gap-3">
            <Avatar className="w-24 h-24 border-4 border-background shrink-0">
<<<<<<< HEAD
              {userProfile?.photoURL && <AvatarImage src={userProfile.photoURL} alt={displayUsername} />}
=======
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {displayUsername[0]?.toUpperCase() || "P"}
              </AvatarFallback>
            </Avatar>

            <div className="flex gap-2 mb-2">
              <Button
                size="sm"
                variant="outline"
                className="shrink-0 touch-manipulation bg-transparent"
                onClick={logout}
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
<<<<<<< HEAD
              <Button
                size="sm"
                variant="outline"
                className="shrink-0 touch-manipulation bg-transparent"
                onClick={openSettings}
              >
=======
              <Button size="sm" variant="outline" className="shrink-0 touch-manipulation bg-transparent">
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
                <Settings className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
            </div>
          </div>

          <div className="mt-3">
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold flex items-center gap-1">
                {displayUsername}
                {userProfile?.isVerified && (
<<<<<<< HEAD
                  <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-500" aria-label="Verified account" />
=======
                  <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-500" title="Verified account" />
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
                )}
              </h2>
              {userProfile?.isPremium && (
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 gap-1">
                  <Crown className="w-3 h-3" />
                  Premium
                </Badge>
              )}
              {tokensReady && (
                <Badge variant="outline" className="border-primary/40 text-primary text-xs gap-1">
                  <Coins className="w-3 h-3" />
                  {tokens.toFixed(3)} SHUB
                </Badge>
              )}
<<<<<<< HEAD
=======
=======
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{displayUsername}</h2>
              {isPremium && (
                <Badge className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white border-0">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              )}
>>>>>>> 82bc3ca8b44839ba49ec0fc525fcb6c408caf7eb
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
            </div>
            <p className="text-sm text-muted-foreground">@{displayUsername}</p>
            {userProfile?.piUid && (
              <p className="text-xs text-muted-foreground/70 mt-1">Pi UID: {userProfile.piUid.slice(0, 8)}...</p>
            )}
          </div>

          <p className="mt-3 text-sm leading-relaxed text-balance">{displayBio}</p>

          <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 shrink-0" />
              <span>{displayLocation}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 shrink-0" />
              <span>Joined {displayJoinedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <LinkIcon className="w-3 h-3 shrink-0" />
              <span className="truncate">{displayWebsite}</span>
            </div>
          </div>

          <div className="mt-4 flex gap-4 text-sm">
            <button className="hover:underline touch-manipulation">
              <span className="font-bold">{displayFollowing}</span>{" "}
              <span className="text-muted-foreground">Following</span>
            </button>
            <button className="hover:underline touch-manipulation">
              <span className="font-bold">{displayFollowers}</span>{" "}
              <span className="text-muted-foreground">Followers</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="border-b border-border px-4 flex gap-1 overflow-x-auto">
          <Button variant="ghost" className="relative h-12 rounded-none border-b-2 border-primary shrink-0">
            Posts
          </Button>
          <Button variant="ghost" className="h-12 rounded-none text-muted-foreground shrink-0">
            Media
          </Button>
          <Button variant="ghost" className="h-12 rounded-none text-muted-foreground shrink-0">
            Likes
          </Button>
        </div>

        <div className="divide-y divide-border">
          {USER_POSTS.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      </div>
<<<<<<< HEAD

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Profile Settings</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                {profilePhotoPreview && <AvatarImage src={profilePhotoPreview} alt="Profile preview" />}
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {profileForm.displayName[0]?.toUpperCase() || "P"}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-2">
                <Label htmlFor="profilePhoto">Profile Picture</Label>
                <Input id="profilePhoto" type="file" accept="image/*" onChange={handleProfilePhotoSelect} />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="displayName">Name</Label>
              <Input
                id="displayName"
                value={profileForm.displayName}
                onChange={(event) => setProfileForm((form) => ({ ...form, displayName: event.target.value }))}
                placeholder="Your name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profileForm.bio}
                onChange={(event) => setProfileForm((form) => ({ ...form, bio: event.target.value }))}
                placeholder="Tell people about yourself"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profileForm.location}
                onChange={(event) => setProfileForm((form) => ({ ...form, location: event.target.value }))}
                placeholder="Location"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={profileForm.website}
                onChange={(event) => setProfileForm((form) => ({ ...form, website: event.target.value }))}
                placeholder="Website"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSettingsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveProfileSettings} disabled={savingProfile}>
              {savingProfile ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
=======
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
    </div>
  )
}
