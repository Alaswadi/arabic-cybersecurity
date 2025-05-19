// This script creates the necessary storage buckets in Supabase
const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or service role key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function createBuckets() {
  try {
    // Create blog-images bucket
    const { data: blogBucket, error: blogError } = await supabase.storage.createBucket('blog-images', {
      public: true,
      fileSizeLimit: 5242880, // 5MB
    })

    if (blogError) {
      console.error('Error creating blog-images bucket:', blogError)
    } else {
      console.log('Created blog-images bucket:', blogBucket)
    }

    // Create service-images bucket
    const { data: serviceBucket, error: serviceError } = await supabase.storage.createBucket('service-images', {
      public: true,
      fileSizeLimit: 5242880, // 5MB
    })

    if (serviceError) {
      console.error('Error creating service-images bucket:', serviceError)
    } else {
      console.log('Created service-images bucket:', serviceBucket)
    }

    console.log('Buckets creation completed')
  } catch (error) {
    console.error('Error creating buckets:', error)
  }
}

createBuckets()
