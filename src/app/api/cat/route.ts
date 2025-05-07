import { NextResponse } from 'next/server';
import { Cat, ICat } from '@/models/cat';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';

// Import dummy cats as templates - only static properties
const dummyCats: (Pick<ICat, 'avatar' | 'name' | 'description'> & { type: number })[] = [
  {
    avatar: "black",
    name: "煤炭",
    description: "好黑啊，像煤炭一样",
    type: 0
  },
  {
    avatar: "xl",
    name: "豆沙包",
    description: "味道怎么样呢～",
    type: 1
  },
  {
    avatar: "orange",
    name: "胖橘",
    type: 2
  },
  {
    avatar: "blue",
    name: "蓝猫",
    type: 3
  },
  {
    avatar: "pattern",
    name: "花岗岩",
    type: 4
  },
  {
    avatar: "white",
    name: "白猫",
    type: 5
  },
  {
    avatar: "gray",
    name: "灰猫",
    type: 6
  },
  {
    avatar: "yellow",
    name: "罗勒",
    description: "是男孩子哦",
    type: 7
  }
];

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
        };
      }
      // If no user data exists, create default values
      return {
        ...template,
        happiness: 0.5,
        hunger: 0.5,
        owned: false,
        x: "0",
        y: "0",
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
        happiness: Math.min(1, existingCat.happiness + 0.1),
        hunger: Math.max(0, existingCat.hunger - 0.1),
        ...data
      };

      cat = await Cat.findOneAndUpdate(
        { _id: existingCat._id },
        updateData,
        { new: true }
      );
    } else {
      // Create new cat if it doesn't exist
      cat = new Cat({
        ...dummyCats.find(t => t.type === data.type),
        ...data,
        happiness: 0.5, // Default values
        hunger: 0.5,
        owned: true,
        userId: session.user._id
      });
      await cat.save();
    }

    // Merge with template data before returning
    const template = dummyCats.find(t => t.type === cat.type);
    return NextResponse.json({
      ...template,
      ...cat.toObject(),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error', details: error }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { id, avatar, name, description, ...updateData } = data; // Remove template data

    const cat = await Cat.findOneAndUpdate(
      { _id: id, userId: session.user.email },
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