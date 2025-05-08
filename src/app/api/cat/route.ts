import { NextResponse } from 'next/server';
import { Cat, ICat } from '@/models/cat';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { dummyCats } from '@/data/cats';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user._id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userCats = await Cat.find({ userId: session.user._id });

    // Merge template data with user data
    const mergedCats = dummyCats.map(template => {
      const userCat = userCats.find(cat => cat.type === template.type);
      if (userCat) {
        return {
          ...template,
          ...userCat.toObject(),
          name: userCat.name || template.name,
          _id: userCat._id,
        };
      }
      // If no user data exists, create default values
      return {
        ...template,
        happiness: 0.5,
        hunger: 0.5,
        owned: false,
        x: (Math.random() * 10 - 5).toFixed(1),
        y: (Math.random() * 4 - 2).toFixed(1),
        taskState: 0,
        userId: session.user?._id
      };
    });

    return NextResponse.json(mergedCats);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Check if a cat of this type already exists for the user
    const existingCat = await Cat.findOne({
      userId: session.user._id,
      type: data.type
    });

    let cat;
    if (existingCat) {
      console.log("Existing cat found: ", existingCat)
      // Update existing cat's values
      const updateData = {
        name: data.name,
        happiness: Math.min(1, existingCat.happiness + 0.1),
        hunger: Math.max(0, existingCat.hunger - 0.1),
      };

      console.log("Update data: ", updateData)
      console.log("Updating cat with ID: ", existingCat._id)

      cat = await Cat.findOneAndUpdate(
        { _id: existingCat._id },
        { $set: updateData },
        { new: true }
      );

      console.log("Updated cat: ", cat.toObject())

      await cat.save();
    } else {
      // Create new cat if it doesn't exist
      cat = new Cat({
        ...dummyCats.find(t => t.type === data.type),
        ...data,
        name: data.name || dummyCats.find(t => t.type === data.type)?.name,
        happiness: 0.5, // Default values
        hunger: 0.5,
        owned: true,
        userId: session.user._id
      });
      await cat.save();
    }

    // Merge with template data before returning
    const template = dummyCats.find(t => t.type === cat.type);
    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }
    console.log("New cat:", {
      ...template,
      ...cat.toObject(),
    })
    return NextResponse.json({
      ...template,
      ...cat.toObject(),
      name: cat.name || template.name,
      _id: cat._id,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error', details: error }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { id, avatar, name, description, ...updateData } = data; // Remove template data

    const cat = await Cat.findOneAndUpdate(
      { _id: id, userId: session.user._id },
      updateData,
      { new: true }
    );

    if (!cat) {
      return NextResponse.json({ error: 'Cat not found' }, { status: 404 });
    }

    // Merge with template data before returning
    const template = dummyCats.find(t => t.type === cat.type);
    return NextResponse.json({
      ...template,
      ...cat.toObject(),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 