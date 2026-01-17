const form = document.getElementById('create-blog-form');
const blogsContainer = document.getElementById('blogs-container');

async function fetchBlogs() {
    try {
        const response = await fetch('/blogs');
        const blogs = await response.json();

        blogsContainer.innerHTML = '';

        blogs.forEach(blog => {
            const blogCard = document.createElement('div');
            blogCard.classList.add('blog-card');

            blogCard.innerHTML = `
                <h3>${blog.title}</h3>
                <span class="blog-meta">By ${blog.author || 'Anonymous'} on ${new Date(blog.createdAt).toLocaleDateString()}</span>
                <p>${blog.body}</p>
                <button class="delete-btn" onclick="deleteBlog('${blog._id}')">Delete</button>
            `;

            blogsContainer.appendChild(blogCard);
        });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        blogsContainer.innerHTML = '<p>Error loading blogs.</p>';
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const body = document.getElementById('body').value;

    try {
        const response = await fetch('/blogs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, author, body })
        });

        if (response.ok) {
            form.reset();
            fetchBlogs(); 
        } else {
            alert('Failed to create blog');
        }
    } catch (error) {
        console.error('Error creating blog:', error);
    }
});

async function deleteBlog(id) {
    if(!confirm("Are you sure you want to delete this?")) return;

    try {
        const response = await fetch(`/blogs/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            fetchBlogs();
        } else {
            alert('Error deleting blog');
        }
    } catch (error) {
        console.error('Error deleting:', error);
    }
}

fetchBlogs();