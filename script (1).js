// اتصال به دیتابیس
const supabaseUrl = 'SUPABASE_URL';      // ← آدرس پروژه را اینجا بگذار
const supabaseKey = 'SUPABASE_KEY';      // ← کلید anon را اینجا بگذار

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// نمایش و مخفی کردن بخش‌ها
function showSection(sectionId) {
    document.getElementById('home').style.display = 'none';
    document.getElementById('add-post').style.display = 'none';
    document.getElementById(sectionId).style.display = 'block';
}

// بارگذاری تجربیات از دیتابیس
async function loadPosts() {
    const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error(error);
        document.getElementById('posts-container').innerHTML = '<p>⚠️ خطا در بارگذاری.</p>';
        return;
    }

    const container = document.getElementById('posts-container');
    container.innerHTML = '';

    if (data.length === 0) {
        container.innerHTML = '<p>هنوز تجربه‌ای ثبت نشده است. اولین نفر باش!</p>';
        return;
    }

    data.forEach(post => {
        container.innerHTML += `
            <div class="post-card">
                <h3>${post.title}</h3>
                <p>${post.body}</p>
                <small>📌 دسته: ${post.category}</small>
            </div>`;
    });
}

// ذخیره تجربه جدید
document.getElementById('experience-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const { error } = await supabase
        .from('experiences')
        .insert({
            title: document.getElementById('title').value,
            category: document.getElementById('category').value,
            body: document.getElementById('body').value
        });

    if (error) {
        alert('❌ خطا در ثبت: ' + error.message);
        return;
    }

    alert('✅ تجربه شما منتشر شد!');
    document.getElementById('title').value = '';
    document.getElementById('body').value = '';
    showSection('home');
    loadPosts();
});

// اجرای اولیه
loadPosts();
