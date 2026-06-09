export type ClientStatus =
  | 'invited'
  | 'onboarding'
  | 'in_progress'
  | 'review'
  | 'delivered'
  | 'archived'

export type StepStatus = 'todo' | 'in_progress' | 'waiting_client' | 'done'

export interface Client {
  id: string
  company_name: string
  contact_name: string | null
  email: string
  phone: string | null
  city: string | null
  region: string | null
  revenue_range: string | null
  status: ClientStatus
  invite_token: string
  invite_sent_at: string | null
  delivery_date: string | null
  created_at: string
  updated_at: string
}

export interface OnboardingResponse {
  id: string
  client_id: string
  section_key: string
  data: Record<string, unknown>
  completed: boolean
  updated_at: string
}

export interface ProjectStep {
  id: string
  client_id: string
  step_key: string
  step_name: string
  step_icon: string
  status: StepStatus
  order_index: number
  admin_notes: string | null
  client_message: string | null
  requires_approval: boolean
  approved_at: string | null
  estimated_date: string | null
  completed_at: string | null
  created_at: string
}

export interface Message {
  id: string
  client_id: string
  sender: 'admin' | 'client'
  content: string
  read: boolean
  created_at: string
}

export interface SharedFile {
  id: string
  client_id: string
  filename: string
  original_name: string
  storage_path: string
  file_type: string | null
  size_bytes: number | null
  uploaded_by: string
  visible_to_client: boolean
  created_at: string
}

export interface FormField {
  id: string
  label: string
  type: 'text' | 'email' | 'tel' | 'number' | 'select' | 'multiselect' | 'checkbox' | 'textarea' | 'file'
  placeholder?: string
  required: boolean
  options?: string[]
  help?: string
}

export interface FormSection {
  id: string
  key: string
  title: string
  icon: string
  description?: string
  fields: FormField[]
}

export interface FormConfig {
  id: number
  config: {
    sections: FormSection[]
  }
  updated_at: string
}
