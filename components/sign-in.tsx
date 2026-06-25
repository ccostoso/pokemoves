"use client"

import { SubmitEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { signInWithEmail } from "@/lib/actions/auth-actions/sign-in"
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type SignInDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function SignInDialog({ open, onOpenChange }: SignInDialogProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get("email") ?? "")
    const password = String(formData.get("password") ?? "")

    const { error } = await signInWithEmail({
      email,
      password,
      callbackURL: "/user/",
    })

    setIsLoading(false)

    if (error) {
      setErrorMessage(error.message ? error.message : "An unknown error occurred.")
      return
    }

    onOpenChange(false)
    router.push("/user/")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form onSubmit={handleSubmit}>
        <DialogContent className='data-open:zoom-in-100! data-open:slide-in-from-top-20 data-open:duration-600 sm:max-w-106.25'>
          <DialogHeader>
            <DialogTitle>Sign in</DialogTitle>
            <DialogDescription>Use your username and password to continue.</DialogDescription>
          </DialogHeader>
          <div className='grid gap-4'>
            <div className='grid gap-3'>
              <Label htmlFor='username'>Username</Label>
              <Input id='username' name='username' type='text' autoComplete='username' required />
            </div>
            <div className='grid gap-3'>
              <Label htmlFor='password'>Password</Label>
              <Input id='password' name='password' type='password' autoComplete='current-password' required />
            </div>
            {errorMessage ? <p className='text-sm text-red-600'>{errorMessage}</p> : null}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline'>Cancel</Button>
            </DialogClose>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
