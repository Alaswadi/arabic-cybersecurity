"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"

interface FormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  subject?: string
  message?: string
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null
    message: string | null
  }>({
    type: null,
    message: null,
  })

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "الاسم مطلوب"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "الاسم يجب أن يحتوي على حرفين على الأقل"
    }

    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "يرجى إدخال بريد إلكتروني صحيح"
    }

    if (!formData.message.trim()) {
      newErrors.message = "الرسالة مطلوبة"
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "الرسالة يجب أن تحتوي على 10 أحرف على الأقل"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset status
    setSubmitStatus({ type: null, message: null })

    // Validate form
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Use the hardcoded service role key endpoint
      const response = await fetch("/api/contact-hardcoded", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Success
        setSubmitStatus({
          type: "success",
          message: data.message || "تم إرسال رسالتك بنجاح. سنتواصل معك قريبًا.",
        })

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        })
      } else {
        // API error
        setSubmitStatus({
          type: "error",
          message: data.message || "حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.",
        })

        // Set field errors if returned from API
        if (data.errors) {
          const fieldErrors: FormErrors = {}
          Object.entries(data.errors).forEach(([key, value]) => {
            if (key !== 'root' && value && (value as any)._errors) {
              fieldErrors[key as keyof FormErrors] = (value as any)._errors[0]
            }
          })
          setErrors(fieldErrors)
        }
      }
    } catch (error) {
      // Network or unexpected error
      console.error("Error submitting form:", error)
      setSubmitStatus({
        type: "error",
        message: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {submitStatus.type && (
        <Alert variant={submitStatus.type === "success" ? "default" : "destructive"}>
          {submitStatus.type === "success" ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>{submitStatus.message}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            الاسم الكامل <span className="text-red-500">*</span>
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="أدخل اسمك الكامل"
            className={`bg-white border-gray-300 text-gray-900 ${
              errors.name ? "border-red-500" : ""
            }`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            البريد الإلكتروني <span className="text-red-500">*</span>
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="أدخل بريدك الإلكتروني"
            className={`bg-white border-gray-300 text-gray-900 ${
              errors.email ? "border-red-500" : ""
            }`}
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          رقم الهاتف
        </label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="أدخل رقم هاتفك"
          className="bg-white border-gray-300 text-gray-900"
        />
      </div>
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
          الموضوع
        </label>
        <Input
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="أدخل موضوع الرسالة"
          className="bg-white border-gray-300 text-gray-900"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          الرسالة <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="اكتب رسالتك هنا..."
          rows={5}
          className={`bg-white border-gray-300 text-gray-900 ${
            errors.message ? "border-red-500" : ""
          }`}
        />
        {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
      </div>
      <Button
        type="submit"
        className="gradient-bg hover:opacity-90 w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            جاري الإرسال...
          </>
        ) : (
          "إرسال الرسالة"
        )}
      </Button>
    </form>
  )
}
