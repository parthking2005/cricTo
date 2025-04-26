"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

const Blog = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch data or pass posts to the component
    const fetchPosts = async () => {
      try {
        const response = [
          {
              id: 1,
              title: 'Blog Post 1',
              excerpt: 'This is the excerpt for Blog Post 1.',
          },
          {
              id: 2,
              title: 'Blog Post 2',
              excerpt: 'This is the excerpt for Blog Post 2.',
          },
          {
              id: 3,
              title: 'Blog Post 3',
              excerpt: 'This is the excerpt for Blog Post 3.',
          },
        ]  // Replace with your data source
        const data = response
        if (Array.isArray(data)) {
          setPosts(data);  // Ensure that the fetched data is an array
        } else {
          setPosts([]);  // Fallback in case the data is not an array
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);  // Fallback on error
      }
    };

    fetchPosts();
  }, []);

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Latest Blogs</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <Link href={`/blog/${post.id}`} className="text-green-500 font-semibold">
                Read More →
              </Link>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No posts available.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Blog;