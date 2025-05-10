/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
require("dotenv").config(); // Load .env file from the project root
const { createClient } = require("@sanity/client");
const { v5: uuidv5 } = require("uuid"); // For generating deterministic UUIDs
const fs = require("fs");
const path = require("path");
const { Readable } = require("stream");

// --- Configuration ---
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN; // Use a WRITE token
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2023-05-03";

console.log("--- Sanity Seeding Configuration ---");
console.log(
  `Project ID: ${projectId ? projectId.substring(0, 5) + "..." : "Not Found"}`
);
console.log(`Dataset: ${dataset || "Not Found"}`);
console.log(`API Token: ${token ? "Found" : "Not Found"}`);
console.log(`API Version: ${apiVersion}`);
console.log("------------------------------------");

// --- Validation ---
if (!projectId || projectId === "placeholder-project-id") {
  console.error(
    "\n❌ Error: The environment variable NEXT_PUBLIC_SANITY_PROJECT_ID is missing or is still set to the placeholder value."
  );
  console.error("   Please update it in your .env file at the project root.");
  process.exit(1);
}
if (!dataset) {
  console.error(
    "\n❌ Error: The environment variable NEXT_PUBLIC_SANITY_DATASET is missing."
  );
  console.error(
    "   Please add it to your .env file (e.g., 'production') at the project root."
  );
  process.exit(1);
}
if (!token) {
  console.error(
    "\n❌ Error: The environment variable SANITY_API_WRITE_TOKEN is missing."
  );
  console.error("   Please add it to your .env file at the project root.");
  console.error(
    "   You can generate one with write permissions from manage.sanity.io -> API."
  );
  process.exit(1);
}

// --- Sanity Client ---
let client;
try {
  client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false, // Always use fresh data for seeding
  });
  console.log("Sanity client initialized successfully.");
} catch (error) {
  console.error("❌ Error initializing Sanity client:", error);
  process.exit(1);
}

// --- UUID Namespace (use a constant value for consistency) ---
const NAMESPACE = "1b671a64-40d5-491e-99b0-da01ff1f3341"; // Example UUID

// --- Seed Data ---
const categories = [
  {
    _type: "category",
    _id: uuidv5("Chandeliers", NAMESPACE),
    name: "Chandeliers",
    slug: { _type: "slug", current: "chandeliers" },
    description:
      "Elegant and grand lighting fixtures, perfect for making a statement.",
  },
  {
    _type: "category",
    _id: uuidv5("Pendant Lights", NAMESPACE),
    name: "Pendant Lights",
    slug: { _type: "slug", current: "pendant-lights" },
    description:
      "Versatile lights hanging from the ceiling, ideal for task or ambient lighting.",
  },
  {
    _type: "category",
    _id: uuidv5("Wall Lights", NAMESPACE),
    name: "Wall Lights",
    slug: { _type: "slug", current: "wall-lights" },
    description:
      "Fixtures mounted on walls, providing accent or supplementary lighting.",
  },
  {
    _type: "category",
    _id: uuidv5("Table Lamps", NAMESPACE),
    name: "Table Lamps",
    slug: { _type: "slug", current: "table-lamps" },
    description:
      "Portable lamps for desks, bedside tables, and accent lighting.",
  },
  {
    _type: "category",
    _id: uuidv5("Floor Lamps", NAMESPACE),
    name: "Floor Lamps",
    slug: { _type: "slug", current: "floor-lamps" },
    description:
      "Standalone lamps offering ambient or task lighting for rooms.",
  },
  {
    _type: "category",
    _id: uuidv5("Switches & Sockets", NAMESPACE),
    name: "Switches & Sockets",
    slug: { _type: "slug", current: "switches-sockets" },
    description: "Essential electrical components with stylish finishes.",
  },
];

const products = [
  // Chandeliers
  {
    name: "Aurora Crystal Chandelier",
    price: 899.99,
    categoryName: "Chandeliers",
    featured: true,
    isNewArrival: true,
    description:
      "An elegant 12-light crystal chandelier with gold accents, perfect for grand living rooms or dining spaces.",
    imageSeeds: ["aurora1", "aurora2"],
  },
  {
    name: "Celeste Glass Globe Chandelier",
    price: 450.0,
    categoryName: "Chandeliers",
    featured: true,
    description:
      "A contemporary design featuring six smoked glass globes with brass fixtures.",
    imageSeeds: ["celeste1", "celeste2", "celeste3"],
  },
  {
    name: "Modern Orbit Chandelier",
    price: 620.5,
    categoryName: "Chandeliers",
    isBestSeller: true,
    description:
      "Sculptural LED rings suspended in balance, combining minimalism and luxury.",
    imageSeeds: ["orbit1"],
  },
  {
    name: "Rustic Farmhouse Chandelier",
    price: 289.0,
    categoryName: "Chandeliers",
    isNewArrival: true,
    description:
      "Wood and iron chandelier with candle-style bulbs, perfect for rustic decor.",
    imageSeeds: ["farmhouse1", "farmhouse2"],
  },
  {
    name: "Antique Bronze Empire Chandelier",
    price: 750.0,
    categoryName: "Chandeliers",
    isNewArrival: true,
    description:
      "Traditional chandelier with cascading beads and an aged bronze finish.",
    imageSeeds: ["empire1"],
  },

  // Pendant Lights
  {
    name: "Amber Glow Pendant Trio",
    price: 199.0,
    categoryName: "Pendant Lights",
    isBestSeller: true,
    description: "A cluster of three amber glass pendants for warm ambiance.",
    imageSeeds: ["amber1", "amber2"],
  },
  {
    name: "Luna Dome Pendant",
    price: 119.99,
    categoryName: "Pendant Lights",
    isBestSeller: true,
    description:
      "Matte black dome pendant light ideal for kitchen islands and modern interiors.",
    imageSeeds: ["luna1", "luna2"],
  },
  {
    name: "Scandi Wood Pendant",
    price: 95.5,
    categoryName: "Pendant Lights",
    isNewArrival: true,
    description:
      "Minimalist Scandinavian-style pendant made from sustainable wood and linen.",
    imageSeeds: ["scandi1"],
  },
  {
    name: "Woven Rattan Pendant",
    price: 149.0,
    categoryName: "Pendant Lights",
    isNewArrival: true,
    description: "Bohemian-style pendant light made from natural woven rattan.",
    imageSeeds: ["rattan1", "rattan2"],
  },
  {
    name: "Industrial Edison Pendant",
    price: 79.99,
    categoryName: "Pendant Lights",
    featured: true,
    description:
      "Single pendant light with an exposed Edison bulb and black cord.",
    imageSeeds: ["edison1", "edison2"],
  },

  // Wall Lights
  {
    name: "Brass & Marble Wall Sconce",
    price: 135.0,
    categoryName: "Wall Lights",
    featured: true,
    description:
      "Luxurious wall sconce combining white marble and brushed brass.",
    imageSeeds: ["brassmarble1"],
  },
  {
    name: "Adjustable Reading Wall Light",
    price: 129.0,
    categoryName: "Wall Lights",
    isBestSeller: true,
    description:
      "Flexible arm wall light in a brushed nickel finish, ideal for bedside reading.",
    imageSeeds: ["reading1", "reading2"],
  },
  {
    name: "Outdoor Cylinder Wall Light",
    price: 85.0,
    categoryName: "Wall Lights",
    isNewArrival: true,
    description:
      "Modern cylindrical outdoor light providing up and down illumination.",
    imageSeeds: ["cylinder1"],
  },
  {
    name: "Minimalist LED Wall Bar",
    price: 75.0,
    categoryName: "Wall Lights",
    description: "Sleek LED wall light providing indirect illumination.",
    imageSeeds: ["wallbar1", "wallbar2"],
  },

  // Table Lamps
  {
    name: "Terracotta Table Lamp",
    price: 89.99,
    categoryName: "Table Lamps",
    featured: true,
    description:
      "Table lamp with a warm terracotta base and a natural fabric shade.",
    imageSeeds: ["terracotta1"],
  },
  {
    name: "Mushroom Dome Table Lamp",
    price: 105.0,
    categoryName: "Table Lamps",
    isBestSeller: true,
    description: "Iconic retro mushroom lamp design in polished chrome.",
    imageSeeds: ["mushroom1", "mushroom2"],
  },
  {
    name: "Wireless Charging Table Lamp",
    price: 79.5,
    categoryName: "Table Lamps",
    isNewArrival: true,
    description:
      "Modern LED table lamp with integrated wireless phone charging base.",
    imageSeeds: ["charginglamp1"],
  },
  {
    name: "Glass Cloche Table Lamp",
    price: 89.99,
    categoryName: "Table Lamps",
    description:
      "Features a decorative bulb inside a clear glass cloche on a wooden base.",
    imageSeeds: ["cloche1"],
  },

  // Floor Lamps
  {
    name: "Arched Marble Floor Lamp",
    price: 299.0,
    categoryName: "Floor Lamps",
    featured: true,
    description:
      "Elegant floor lamp with a heavy marble base and a dramatic arching arm.",
    imageSeeds: ["archmarble1", "archmarble2"],
  },
  {
    name: "Tripod Floor Lamp",
    price: 179.0,
    categoryName: "Floor Lamps",
    isBestSeller: true,
    description:
      "Stylish floor lamp with wooden tripod legs and a large drum shade.",
    imageSeeds: ["tripod1"],
  },
  {
    name: "Task Floor Lamp - Matte Black",
    price: 159.0,
    categoryName: "Floor Lamps",
    description:
      "Adjustable floor lamp in matte black, perfect for focused task lighting.",
    imageSeeds: ["taskblack1"],
  },
  {
    name: "Torchiere Floor Lamp with Reading Light",
    price: 99.0,
    categoryName: "Floor Lamps",
    isNewArrival: true,
    description:
      "Upward-facing torchiere lamp with an additional flexible reading light.",
    imageSeeds: ["torchiere1"],
  },

  // Switches & Sockets
  {
    name: "Brushed Brass Light Switch - Double",
    price: 28.99,
    categoryName: "Switches & Sockets",
    isBestSeller: true,
    description: "Elegant double light switch with a brushed brass finish.",
    imageSeeds: ["brassswitch1"],
  },
  {
    name: "Matte Black USB Socket Outlet",
    price: 29.5,
    categoryName: "Switches & Sockets",
    featured: true,
    description:
      "Modern double socket in matte black with USB-A and USB-C ports.",
    imageSeeds: ["blackusb1"],
  },
  {
    name: "Classic Toggle Dimmer Switch",
    price: 35.0,
    categoryName: "Switches & Sockets",
    isNewArrival: true,
    description: "Vintage-style toggle dimmer switch in chrome.",
    imageSeeds: ["toggledimmer1"],
  },
  {
    name: "Smart Wi-Fi Dimmer Switch",
    price: 45.0,
    categoryName: "Switches & Sockets",
    isNewArrival: true,
    description:
      "Control and dim your lights via Wi-Fi using a smartphone app or voice assistant.",
    imageSeeds: ["smartdimmer1"],
  },
];

// --- Image Handling ---
const imageDir = path.join(__dirname, "images"); // Directory for placeholder images
if (!fs.existsSync(imageDir)) {
  try {
    fs.mkdirSync(imageDir);
    console.log(`Created image directory: ${imageDir}`);
  } catch (error) {
    console.error(`❌ Error creating image directory ${imageDir}:`, error);
    process.exit(1);
  }
}

// Simple function to fetch a placeholder image and upload to Sanity
async function getPlaceholderImage(seed, width = 600, height = 400) {
  const filename = `${seed}.jpg`;
  const filepath = path.join(imageDir, filename);
  const imageUrl = `https://picsum.photos/seed/${seed}/${width}/${height}`; // Using Picsum for placeholders

  // Check if image already exists locally
  if (!fs.existsSync(filepath)) {
    console.log(
      `⏳ Downloading placeholder image for seed "${seed}" from ${imageUrl}...`
    );
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch image: ${response.status} ${response.statusText}`
        );
      }
      const imageStream = Readable.fromWeb(response.body);
      const fileStream = fs.createWriteStream(filepath);
      await new Promise((resolve, reject) => {
        imageStream.pipe(fileStream);
        imageStream.on("error", reject);
        fileStream.on("finish", resolve);
      });
      console.log(`✅ Downloaded and saved placeholder image: ${filepath}`);
    } catch (fetchError) {
      console.error(
        `❌ Error downloading image for seed "${seed}":`,
        fetchError.message
      );
      const base64Image =
        "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+f+iiigD/2Q==";
      fs.writeFileSync(filepath, Buffer.from(base64Image, "base64"));
      console.warn(
        `⚠️ Created dummy image file due to download failure: ${filepath}`
      );
    }
  }

  // Upload the local image file to Sanity
  console.log(`⏳ Uploading image asset from path: ${filepath}`);
  try {
    const stream = fs.createReadStream(filepath);
    const asset = await client.assets.upload("image", stream, {
      filename: filename,
      contentType: "image/jpeg",
    });
    console.log(`✅ Uploaded image asset: ${asset._id} for ${filename}`);
    return {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: asset._id,
      },
      // Default hotspot/crop values
      hotspot: {
        _type: "sanity.imageHotspot",
        x: 0.5,
        y: 0.5,
        height: 1.0,
        width: 1.0,
      },
      crop: { _type: "sanity.imageCrop", top: 0, bottom: 0, left: 0, right: 0 },
      alt: `Placeholder image for ${seed}`, // Add default alt text
    };
  } catch (error) {
    if (
      error.message &&
      error.message.includes("Duplicate asset SHA-1 digest")
    ) {
      console.warn(
        `⚠️ Image ${filename} already exists in Sanity based on content hash. Skipping upload.`
      );
      // You might want to query for the existing asset ID here if needed for strict deduplication
      return null; // Indicate skipped upload (or query and return existing)
    } else {
      console.error(
        `❌ Error uploading image asset ${filename}:`,
        error.message
      );
      if (error.response && error.response.body) {
        console.error(
          "Sanity API Error Body:",
          JSON.stringify(error.response.body, null, 2)
        );
      }
      return null; // Indicate failure
    }
  }
}

// --- Seeding Function ---
async function seedData() {
  console.log("\n🚀 Starting Sanity data seeding...");
  const startTime = Date.now();

  // --- Seed Categories ---
  console.log("\n⏳ Seeding categories...");
  const categoryTransaction = categories.reduce((tx, category) => {
    console.log(`   Adding category: ${category.name} (ID: ${category._id})`);
    return tx.createOrReplace(category);
  }, client.transaction());

  try {
    const result = await categoryTransaction.commit({
      autoGenerateArrayKeys: true,
    });
    console.log(
      `✅ Successfully committed ${result.results.length} category operations.`
    );
    result.results.forEach((res) => {
      console.log(`   - ${res.operation}: ${res.id}`);
    });
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    if (error.response && error.response.body) {
      console.error(
        "Sanity API Error Details:",
        JSON.stringify(error.response.body, null, 2)
      );
    }
    console.warn(
      "⚠️ Proceeding without categories. Products might not link correctly."
    );
  }

  // --- Seed Products ---
  console.log("\n⏳ Seeding products...");
  const productTransaction = client.transaction();
  let productsToAddCount = 0;
  const categoryMap = new Map(categories.map((cat) => [cat.name, cat._id])); // Map category names to IDs

  for (const productData of products) {
    console.log(`\n   Processing product: ${productData.name}`);
    const categoryRefId = categoryMap.get(productData.categoryName);
    if (!categoryRefId) {
      console.warn(
        `   ⚠️ Category "${productData.categoryName}" not found for product "${productData.name}". Skipping.`
      );
      continue;
    } else {
      console.log(`      Found category ref: ${categoryRefId}`);
    }

    const productId = uuidv5(productData.name, NAMESPACE);
    const slug = productData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 90);
    console.log(`      Generated ID: ${productId}, Slug: ${slug}`);

    // Get placeholder image asset references for the array
    const imageAssets = [];
    if (productData.imageSeeds && productData.imageSeeds.length > 0) {
      for (const seed of productData.imageSeeds) {
        const imageAsset = await getPlaceholderImage(seed); // Reuse the function
        if (imageAsset) {
          // Add a unique _key for each image in the array
          imageAssets.push({ ...imageAsset, _key: uuidv5(seed, NAMESPACE) });
        } else {
          console.warn(
            `      ⚠️ Failed to get or upload image with seed "${seed}" for product "${productData.name}".`
          );
        }
      }
    }

    // Ensure at least one image exists, otherwise skip the product
    if (imageAssets.length === 0) {
      // If no seeds provided or all failed, try a default based on slug
      const defaultImageAsset = await getPlaceholderImage(slug);
      if (defaultImageAsset) {
        imageAssets.push({
          ...defaultImageAsset,
          _key: uuidv5(slug, NAMESPACE),
        });
      } else {
        console.warn(
          `   ⚠️ No valid images found or generated for "${productData.name}". Skipping product.`
        );
        continue; // Skip product if no images could be processed
      }
    }

    console.log(`      Processed ${imageAssets.length} image(s).`);

    const productDoc = {
      _type: "product",
      _id: productId,
      name: productData.name,
      slug: { _type: "slug", current: slug },
      description:
        productData.description ||
        `${productData.name} description placeholder.`,
      price: productData.price,
      images: imageAssets, // Assign the array of image assets
      category: {
        _type: "reference",
        _ref: categoryRefId,
      },
      featured: productData.featured || false,
      isBestSeller: productData.isBestSeller || false,
      isNewArrival: productData.isNewArrival || false,
    };

    console.log(`      Adding product document to transaction.`);
    productTransaction.createOrReplace(productDoc);
    productsToAddCount++;
  }

  try {
    if (productsToAddCount > 0) {
      console.log(
        `\n⏳ Committing ${productsToAddCount} product operations...`
      );
      const result = await productTransaction.commit({
        autoGenerateArrayKeys: true,
      });
      console.log(
        `✅ Successfully committed ${result.results.length} product operations.`
      );
      result.results.forEach((res) => {
        console.log(`   - ${res.operation}: ${res.id}`);
      });
    } else {
      console.log("\n✅ No valid products to add to the transaction.");
    }
  } catch (error) {
    console.error("\n❌ Error seeding products:", error);
    if (error.response && error.response.body) {
      console.error(
        "Sanity API Error Details:",
        JSON.stringify(error.response.body, null, 2)
      );
    }
  }

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  console.log(`\n🏁 Sanity data seeding finished in ${duration} seconds.`);
}

// --- Run Seeding ---
seedData().catch((err) => {
  console.error("\n❌ Unhandled fatal error during seeding:", err);
  process.exit(1);
});
