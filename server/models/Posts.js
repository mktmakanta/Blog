const mongoose = require('mongoose');
const slugify = require('slugify');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 200,
    },
    slug: {
      // slug: is unique URL-friendly version of the title for SEO
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    image: {
      type: String,
      default: 'https://ui-avatars.com/api/?name=User&background=random',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // relation to User model
      required: true,
    },
    published: {
      type: Boolean,
      default: false,
    },

    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment', // reference Comment model
      },
    ],
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // reference Category model
      },
    ],
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        ref: 'Tag',
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PostLike',
      },
    ],
  },
  { timestamps: true }
);

// Auto-generate unique slug from title
postSchema.pre('save', async function (next) {
  if (this.isModified('title')) {
    let baseSlug = slugify(this.title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    // Check if slug already exists
    while (await mongoose.models.Post.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }
  next();
});

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

module.exports = Post;
