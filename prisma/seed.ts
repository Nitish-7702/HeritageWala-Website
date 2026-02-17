import { PrismaClient } from '../src/generated/client'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient({})

async function main() {
  console.log('Start seeding ...')

  // Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sheritagewala.com' },
    update: {},
    create: {
      email: 'admin@sheritagewala.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  console.log(`Created user with id: ${admin.id}`)

  const existingSettings = await prisma.settings.findFirst()
  if (!existingSettings) {
    const settings = await prisma.settings.create({
      data: {
        maxGuestsPerSlot: 40,
        maxGuestsPerReservation: 10,
        slotIntervalMinutes: 15,
      },
    })
    console.log(`Created settings with id: ${settings.id}`)
  }

  // Clear existing data to avoid duplicates and foreign key constraints
  await prisma.orderItem.deleteMany({})
  await prisma.order.deleteMany({})
  await prisma.menuItem.deleteMany({})
  await prisma.menuCategory.deleteMany({})

  // Menu Categories and Items
  const categories = [
    {
      name: 'Starters',
      slug: 'starters',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop',
      items: [
        { 
          name: 'Chicken Liver Kali Mirchi', 
          description: 'Pan seared chicken livers with our signature crushed black pepper blend', 
          price: 7.99, 
          isVeg: false, 
          spiceLevel: 3, 
          image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800&auto=format&fit=crop' 
        },
        { 
          name: 'Gobi 65 (V)', 
          description: 'Crispy fried cauliflower florets tossed with southern spice mix', 
          price: 7.99, 
          isVeg: true, 
          spiceLevel: 2, 
          image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop' 
        },
        { 
          name: 'Peri - Peri Wings', 
          description: 'A recipe of chicken wings, coated with garlic & chilli powder, roasted with homemade peri peri sauce.', 
          price: 7.99, 
          isVeg: false, 
          spiceLevel: 3, 
          image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=800&auto=format&fit=crop' 
        },
        { 
          name: 'Chicken 65', 
          description: 'Golden fried chicken tossed in southern spice blend and curry leaves', 
          price: 8.99, 
          isVeg: false, 
          spiceLevel: 3, 
          image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=800&auto=format&fit=crop' 
        },
        { 
          name: 'Paneer Tikka', 
          description: 'Cottage cheese, mixed peppers seasoned with pickling spiced hung curd', 
          price: 8.99, 
          isVeg: true, 
          spiceLevel: 2, 
          image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=800&auto=format&fit=crop' 
        },
        { 
          name: 'Veg Manchuria (V)', 
          description: 'Fried vegetable dumplings tossed in ginger soy blend', 
          price: 8.99, 
          isVeg: true, 
          spiceLevel: 2, 
          image: 'https://images.unsplash.com/photo-1529042410759-befb1204b465?q=80&w=800&auto=format&fit=crop' 
        },
        { 
          name: 'Soya Chaap', 
          description: 'Tender soya chaap marinated in rice spice blend served with mint yoghurt', 
          price: 8.99, 
          isVeg: true, 
          spiceLevel: 2, 
          image: 'https://images.unsplash.com/photo-1529006557810-274bc021f481?q=80&w=800&auto=format&fit=crop' 
        },
        { 
          name: 'Chicken Sheek kebab', 
          description: 'Minced chicken skewers with herbs.', 
          price: 8.99, 
          isVeg: false, 
          spiceLevel: 2, 
          image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop' 
        },
        { 
          name: 'Chilli Egg', 
          description: 'Boiled eggs tossed in bold chilli-garlic sauce.', 
          price: 9.49, 
          isVeg: false, 
          spiceLevel: 3, 
          image: 'https://images.unsplash.com/photo-1506806864753-b6d37651c6b1?q=80&w=800&auto=format&fit=crop' 
        },
        { 
          name: 'Tulip Mushroom', 
          description: 'Marinated mushroom petals fried to a royal crunch.', 
          price: 9.99, 
          isVeg: true, 
          spiceLevel: 2, 
          image: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?q=80&w=800&auto=format&fit=crop' 
        },
        { 
          name: 'Chilli Chicken', 
          description: 'Chicken tenders wok tossed with onions, peppers and fiery oriental sauce', 
          price: 9.99, 
          isVeg: false, 
          spiceLevel: 3, 
          image: 'https://images.unsplash.com/photo-1562967960-f0d04c1f1734?q=80&w=800&auto=format&fit=crop' 
        },
        { 
          name: 'Paneer 65', 
          description: 'Hyderabadi-style fried paneer with garlic and curry leaves.', 
          price: 9.99, 
          isVeg: true, 
          spiceLevel: 3, 
          image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=800&auto=format&fit=crop' 
        },
        { 
          name: 'Mushroom 65', 
          description: 'Mushroom in fiery 65 masala with curry leaves.', 
          price: 9.99, 
          isVeg: true, 
          spiceLevel: 3, 
          image: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?q=80&w=800&auto=format&fit=crop' 
        },
        { 
          name: 'Chicken Lollipops (5 Pieces)', 
          description: 'The OG chicken wings of India dressed in street style schezwan', 
          price: 9.99, 
          isVeg: false, 
          spiceLevel: 3, 
          image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=800&auto=format&fit=crop' 
        },
        { 
          name: 'Chilli Paneer (V)', 
          description: 'Wok tossed paneer, peppers and onion in velvety chilli sauce.', 
          price: 9.99, 
          isVeg: true, 
          spiceLevel: 3, 
          image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=800&auto=format&fit=crop' 
        },
        { 
          name: 'Lamb Sheekh Kebab', 
          description: 'Tender Chunks of Lamb Marinated in a blend of aromatic spiced yoghurt', 
          price: 9.99, 
          isVeg: false, 
          spiceLevel: 2, 
          image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6f58520?q=80&w=800&auto=format&fit=crop' 
        },
        { 
          name: 'Tangdi Roast', 
          description: 'Coated chicken drumsticks cooked with a dose of sub-continental spices.', 
          price: 10.99, 
          isVeg: false, 
          spiceLevel: 3, 
          image: 'https://images.unsplash.com/photo-1594221708779-94832f4320d1?q=80&w=800&auto=format&fit=crop' 
        },
        { 
          name: 'Half Tandoori Chicken', 
          description: 'Half chicken marinated in fiery spice mix', 
          price: 10.99, 
          isVeg: false, 
          spiceLevel: 3, 
          image: 'https://images.unsplash.com/photo-1628294895950-98052523e036?q=80&w=800&auto=format&fit=crop' 
        },
        { 
          name: 'Chicken Tikka', 
          description: 'Boneless tikka grilled to perfection.', 
          price: 10.99, 
          isVeg: false, 
          spiceLevel: 2, 
          image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=800&auto=format&fit=crop' 
        },
        { 
          name: 'Chicken Majestic', 
          description: 'Boneless chicken breast strips tossed in lime, and mint, finished with fresh herbs.', 
          price: 10.99, 
          isVeg: false, 
          spiceLevel: 2, 
          image: 'https://images.unsplash.com/photo-1606728035253-49e8a23146de?q=80&w=800&auto=format&fit=crop' 
        },
        { 
          name: 'Chicken 555', 
          description: 'Fried chicken strips tossed in a rich creamy sauce.', 
          price: 10.99, 
          isVeg: false, 
          spiceLevel: 2, 
          image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?q=80&w=800&auto=format&fit=crop' 
        },
        { 
          name: 'Apollo Fish', 
          description: 'Batter fried fish fillets rolled in curry leaves ajwain tempered yoghurt', 
          price: 10.99, 
          isVeg: false, 
          spiceLevel: 2, 
          image: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?q=80&w=800&auto=format&fit=crop' 
        },
        { 
          name: 'Pepper Chicken', 
          description: 'Chicken chunks cooked with crushed black pepper and spices.', 
          price: 10.99, 
          isVeg: false, 
          spiceLevel: 3, 
          image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?q=80&w=800&auto=format&fit=crop' 
        },
        { 
          name: 'Garlic Fish', 
          description: 'Battered Fish cooked in hot garlic sauce.', 
          price: 11.99, 
          isVeg: false, 
          spiceLevel: 2, 
          image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800&auto=format&fit=crop' 
        },
        { 
          name: 'Chilli Prawn', 
          description: 'Deep-Fried prawns tossed in chilli sauce and house spices.', 
          price: 12.99, 
          isVeg: false, 
          spiceLevel: 3, 
          image: 'https://images.unsplash.com/photo-1559742811-822873691df8?q=80&w=800&auto=format&fit=crop' 
        },
        { 
          name: 'Lamb Chops', 
          description: 'French trimmed lamb chops coated in whole ground spices and fiery guntur chilli', 
          price: 12.99, 
          isVeg: false, 
          spiceLevel: 3, 
          image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=800&auto=format&fit=crop' 
        },
        { 
          name: 'Peri Peri Fish', 
          description: 'Fiery peri-peri spice on crisp fillets.', 
          price: 12.99, 
          isVeg: false, 
          spiceLevel: 3, 
          image: 'https://images.unsplash.com/photo-1580959375944-fdd80d733599?q=80&w=800&auto=format&fit=crop' 
        },
        { 
          name: 'Pepper Lamb', 
          description: 'Tender lamb cooked dry with cracked pepper and coriander.', 
          price: 13.99, 
          isVeg: false, 
          spiceLevel: 3, 
          image: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?q=80&w=800&auto=format&fit=crop' 
        },
        { 
          name: 'Lamb Ghee Roast', 
          description: 'Slow-roasted lamb in ghee and red-chilli masala.', 
          price: 14.99, 
          isVeg: false, 
          spiceLevel: 3, 
          image: 'https://images.unsplash.com/photo-1585937421612-70a008356f36?q=80&w=800&auto=format&fit=crop' 
        },
        { 
          name: 'Whole Tandoori Chicken', 
          description: 'Whole chicken marinated in fiery spice mix', 
          price: 14.99, 
          isVeg: false, 
          spiceLevel: 3, 
          image: 'https://images.unsplash.com/photo-1628294895950-98052523e036?q=80&w=800&auto=format&fit=crop' 
        },
      ]
    },
    {
      name: 'Soups',
      slug: 'soups',
      image: 'https://images.unsplash.com/photo-1547592166-23acbe346499?q=80&w=800&auto=format&fit=crop',
      items: [
        { name: 'Sweet Corn Soup', description: 'Indo-Chinese style soup made with mixed veggies and sweet corn.', price: 6.99, isVeg: true, spiceLevel: 1, image: 'https://images.unsplash.com/photo-1547592166-23acbe346499?q=80&w=800&auto=format&fit=crop' },
        { name: 'Hot and Sour Chicken Soup', description: 'Spicy and tangy soup with shredded chicken.', price: 7.99, isVeg: false, spiceLevel: 3, image: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?q=80&w=800&auto=format&fit=crop' },
      ]
    },
    {
      name: 'Biryani',
      slug: 'biryani',
      image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=800&auto=format&fit=crop',
      items: [
        { name: 'Hyderabadi Chicken Dum Biryani', description: 'World-famous biryani made with basmati rice and chicken marinated in secret spices.', price: 14.99, isVeg: false, spiceLevel: 3, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop' },
        { name: 'Mutton Biryani', description: 'Tender mutton pieces cooked with aromatic basmati rice.', price: 16.99, isVeg: false, spiceLevel: 3, image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=800&auto=format&fit=crop' },
        { name: 'Veg Biryani', description: 'Aromatic rice dish made with mixed vegetables and spices.', price: 12.99, isVeg: true, spiceLevel: 2, image: 'https://images.unsplash.com/photo-1642821373181-696a54913e93?q=80&w=800&auto=format&fit=crop' },
      ]
    },
    {
      name: 'Curries',
      slug: 'curries',
      image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=800&auto=format&fit=crop',
      items: [
        { name: 'Butter Chicken', description: 'Chicken cooked in a mildly spiced tomato gravy.', price: 13.99, isVeg: false, spiceLevel: 1, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=800&auto=format&fit=crop' },
        { name: 'Paneer Butter Masala', description: 'Paneer cubes cooked in a rich and creamy tomato gravy.', price: 12.99, isVeg: true, spiceLevel: 1, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800&auto=format&fit=crop' },
        { name: 'Dal Makhani', description: 'Whole black lentils cooked with butter and cream.', price: 11.99, isVeg: true, spiceLevel: 1, image: 'https://images.unsplash.com/photo-1585937421612-70a008356f36?q=80&w=800&auto=format&fit=crop' },
        { 
          name: 'Haleem', 
          description: 'A rich stew of meat, lentils, and wheat, pounded to a smooth consistency.', 
          price: 12.95, 
          isVeg: false, 
          spiceLevel: 2, 
          image: '/images/haleem.jpg' 
        },
      ]
    },
    {
      name: 'Breads & Rice',
      slug: 'breads-rice',
      image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=800&auto=format&fit=crop',
      items: [
        { name: 'Butter Naan', description: 'Leavened flatbread cooked in a tandoor and brushed with butter.', price: 4.99, isVeg: true, spiceLevel: 0, image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=800&auto=format&fit=crop' },
        { name: 'Garlic Naan', description: 'Naan topped with chopped garlic and coriander.', price: 5.49, isVeg: true, spiceLevel: 0, image: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?q=80&w=800&auto=format&fit=crop' },
        { name: 'Jeera Rice', description: 'Basmati rice flavored with cumin seeds.', price: 5.99, isVeg: true, spiceLevel: 0, image: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?q=80&w=800&auto=format&fit=crop' },
      ]
    },
     {
      name: 'Desserts',
      slug: 'desserts',
      image: 'https://images.unsplash.com/photo-1593701478530-827b952b2106?q=80&w=800&auto=format&fit=crop',
      items: [
        { name: 'Gulab Jamun', description: 'Deep-fried dough balls soaked in sugar syrup.', price: 6.99, isVeg: true, spiceLevel: 0, image: 'https://images.unsplash.com/photo-1593701478530-827b952b2106?q=80&w=800&auto=format&fit=crop' },
        { name: 'Rasmalai', description: 'Flattened balls of chhana soaked in malai.', price: 7.49, isVeg: true, spiceLevel: 0, image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?q=80&w=800&auto=format&fit=crop' },
        { 
          name: 'Double Ka Meetha', 
          description: 'A classic Hyderabadi bread pudding dessert soaked in saffron milk and garnished with dry fruits.', 
          price: 7.95, 
          isVeg: true, 
          spiceLevel: 0, 
          image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=800&auto=format&fit=crop' 
        },
      ]
    }
  ]

  for (const cat of categories) {
    const category = await prisma.menuCategory.upsert({
      where: { slug: cat.slug },
      update: {
        image: cat.image
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        image: cat.image,
      },
    })

    for (const item of cat.items) {
      await prisma.menuItem.create({
        data: {
          name: item.name,
          description: item.description,
          price: item.price,
          isVeg: item.isVeg,
          spiceLevel: item.spiceLevel,
          image: item.image,
          categoryId: category.id
        },
      })
    }
  }

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
