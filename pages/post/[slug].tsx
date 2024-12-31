import React, { useState, useEffect } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { sanityClient, urlFor } from '../../sanity';
import { Post as PostType } from '../../typing';
import { PortableText } from '@portabletext/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { GetStaticProps } from 'next';
import Image from 'next/image';

interface Props {
  post: PostType;
}

type Inputs = {
  _id: string;
  name: string;
  email: string;
  comment: string;
};

// Ensure the Comment interface is properly typed
interface Comment {
  _id: string;
  name: string;
  comment: string;
  email: string;
  approved: boolean;
  post: { _ref: string; _type: 'reference' };
  publishedAt: string;
  replies: any[];
}

const Post = ({ post }: Props) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<Inputs>();

  // Fetch comments when post loads
  useEffect(() => {
    const fetchComments = async () => {
      const response = await fetch(`/api/getComments?postId=${post._id}`);
      const result = await response.json();
      setComments(result.comments || []);
    };

    fetchComments();
  }, [post._id]);

  // Handle comment submission




  




  // Optimistically add the new comment and fetch approved comments
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const newComment: Comment = {
        _id: Math.random().toString(36).slice(2, 11),
        name: data.name,
        comment: data.comment,
        email: data.email,
        approved: false,
        post: { _ref: post._id, _type: 'reference' },
        publishedAt: new Date().toISOString(),
        replies: [],
      };
  
      // Optimistic update
      setComments((prevComments) => [...prevComments, newComment]);
  
      // Send the comment to the API
      await fetch('/api/createComment', {
        method: 'POST',
        body: JSON.stringify(data),
      });
  
      // Fetch approved comments again
      const response = await fetch(`/api/getComments?postId=${post._id}`);
      const result = (await response.json()) as { comments: Comment[] }; // Explicitly type the response
  
      // Merge fetched comments with the optimistically added comment
      setComments((prevComments) => {
        const mergedComments = [
          ...result.comments,
          ...prevComments.filter((c) => !result.comments.some((r: Comment) => r._id === c._id)), // Explicitly type `r` as Comment
        ];
        return mergedComments;
      });
  
      reset();
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };
  









  return (
    <div>
      <Header />
      <img
        className="w-full h-96 object-cover"
        src={urlFor(post.mainImage).url()!}
        alt="coverImage"
      />
      <div className="max-w-3xl mx-auto mb-10">
        <article className="w-full mx-auto p-5 bg-secondaryColor/10">
          <h1 className="font-titleFont font-medium text-[32px] text-primary border-b-[1px] border-b-cyan-800 mt-10 mb-3">
            {post.title}
          </h1>
          <h2 className="font-bodyFont text-[18px] text-gray-500 mb-2">
            {post.description}
          </h2>
          <div className="flex items-center gap-2">
            <img
              className="rounded-full w-12 h-12 object-cover bg-red-400"
              src={urlFor(post.author.image).url()}
              alt="authorImage"
            />
            <p className="font-bodyFont text-base">
              Blog post by{' '}
              <span className="font-bold text-secondaryColor">
                {post.author.name}
              </span>{' '}
              - Published at{' '}
              {new Date(post.publishedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="mt-10">
          <PortableText
  value={post.body}
  components={{
    block: {
      h1: ({ children }) => (
        <h1 className="text-2xl font-bold my-5 font-titleFont">{children}</h1>
      ),
      h2: ({ children }) => (
        <h2 className="text-xl font-bold my-5 font-titleFont">{children}</h2>
      ),
      normal: ({ children }) => (
        <p className="text-base my-5 font-bodyFont">{children}</p>
      ),
    },
    marks: {
      link: ({ value, children }) => (
        <a
          href={value.href}
          className="text-cyan-500 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      ),
    },
    types: {
      image: ({ value }) => {
        if (!value?.asset) return null;
        
        return (
          <div className="my-6 w-full">
            <Image
              src={urlFor(value).url()}
              alt={value.alt || 'Blog post image'}
              width={800}
              height={600}
              className="object-cover rounded-lg"
              placeholder="blur"
              blurDataURL={urlFor(value).width(20).blur(30).url()}
            />
            {value.caption && (
              <p className="text-center text-sm text-gray-500 mt-2">
                {value.caption}
              </p>
            )}
          </div>
        );
      },
    },
  }}
/>
          </div>
        </article>
        <hr className="max-w-lg my-5 mx-auto border[1px] border-secondaryColor" />
        <div>
          <p className="text-xs text-secondaryColor uppercase font-titleFont font-bold">
            Enjoyed this article?
          </p>
          <h3 className="font-titleFont text-3xl font-bold">
            Leave a Comment below...!
          </h3>
          <hr className="py-3 mt-2" />
          <form onSubmit={handleSubmit(onSubmit)} className="mt-7 flex flex-col gap-6">
            <input {...register('_id')} type="hidden" value={post._id} />
            <label className="flex flex-col">
              <span className="font-titleFont font-semibold text-base">Name</span>
              <input
                {...register('name', { required: true })}
                className="text-base placeholder:text-sm border-b-[1px] border-secondaryColor py-1 px-4 outline-none focus-within:shadow-xl shadow-secondaryColor"
                type="text"
                placeholder="Enter your name"
              />
            </label>

            <label className="flex flex-col">
              <span className="font-titleFont font-semibold text-base">Email</span>
              <input
                {...register('email', { required: true })}
                className="text-base placeholder:text-sm border-b-[1px] border-secondaryColor py-1 px-4 outline-none focus-within:shadow-xl shadow-secondaryColor"
                type="email"
                placeholder="Enter your email"
              />
            </label>

            <label className="flex flex-col">
              <span className="font-titleFont font-semibold text-base">Comment</span>
              <textarea
                {...register('comment', { required: true })}
                className="text-base placeholder:text-sm border-b-[1px] border-secondaryColor py-1 px-4 outline-none focus-within:shadow-xl shadow-secondaryColor"
                rows={6}
                placeholder="Leave a comment"
              />
            </label>

            <button
              className="w-full bg-bgColor text-white text-base font-titleFont font-semibold tracking-wider uppercase py-2 rounded-sm hover:bg-secondaryColor duration-300"
              type="submit"
            >
              Submit
            </button>
          </form>
          <div className="w-full flex flex-col p-10 my-10 mx-auto shadow-bgColor shadow-lg space-y-2">
            <h3 className="text-3xl font-titleFont font-semibold">Comment</h3>
            <hr className='py-3 mt-2' />
            {comments.map((comment) => (
              <div key={comment._id} className="w-full flex flex-col p-10 my-10 mx-auto shadow-bgColor shadow-lg space-y-2">
                <p className='flex flex-col'>
                  <span className="text-secondaryColor">{comment.name}</span>{' '}
                  {comment.comment}
                </p>
              </div>
            ))}
          </div>
          <hr />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Post;

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{
    _id,
    slug {
      current
    }
  }`;

  const posts = await sanityClient.fetch(query);
  const paths = posts.map((post: PostType) => ({
    params: { slug: post.slug.current },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
    _id,
    publishedAt,
    title,
    author->{
      name,
      image
    },
    "comments": *[_type == "comment" && post._ref == ^._id && approved == true],
    description,
    mainImage,
    slug,
    body[] 
  }`;

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  });

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    revalidate: 60,
  };
};
