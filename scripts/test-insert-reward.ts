import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing environment variables.')
    console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testInsertReward() {
    console.log('🚀 Testing "Insert Reward" via Terminal...')
    console.log('Connecting to Supabase at:', supabaseUrl)

    const dummyReward = {
        name: 'Test Reward Terminal ' + new Date().getTime().toString().slice(-4),
        price: 999,
        stock: 5,
        image_url: null // Skip image for terminal test
    }

    console.log('Attempting to insert:', dummyReward)

    const { data, error } = await supabase
        .from('products')
        .insert(dummyReward)
        .select()
        .single()

    if (error) {
        console.error('❌ Failed to insert reward:', error.message)
    } else {
        console.log('✅ Success! Reward inserted:')
        console.log(data)
        console.log('\nPlease refresh your Admin Rewards page to see it.')
    }
}

testInsertReward()
