const supabaseUrl = "https://zdnnitvylhcbqufodwjc.supabase.co";
const supabaseKey = "sb_publishable_FvwPiwyPqUwc-O5CuhepOw_0fnDz5f-";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Data from your image
const menuItems = [
    { name: "Veg Noodles", price: 80, cat: "noodles", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200" },
    { name: "Chicken Noodles", price: 120, cat: "noodles", img: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=200" },
    { name: "Veg Pizza", price: 69, cat: "pizza", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200" },
    { name: "Chicken Pizza", price: 99, cat: "pizza", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200" },
    { name: "Red Sauce Pasta", price: 60, cat: "pasta", img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=200" }
];

let cart = [];

function renderMenu(items) {
    const container = document.getElementById('menu-container');
    container.innerHTML = items.map(item => `
        <div class="dish-card">
            <img src="${item.img}" class="dish-img">
            <div class="dish-info">
                <h3>${item.name}</h3>
                <p>Freshly prepared</p>
                <div style="font-weight: 800;">₹${item.price}/-</div>
            </div>
            <div class="add-btn" onclick="addToCart('${item.name}')">+</div>
        </div>
    `).join('');
    
    // Smooth reveal animation
    gsap.from(".dish-card", { opacity: 0, x: -20, stagger: 0.1, duration: 0.5 });
}

function addToCart(name) {
    cart.push(name);
    // Simple haptic feedback simulation
    gsap.to(".floating-order", { scale: 1.1, duration: 0.1, yoyo: true, repeat: 1 });
}

async function placeOrder() {
    if(cart.length === 0) return alert("Your tray is empty!");
    
    const params = new URLSearchParams(window.location.search);
    const tableNo = params.get("table") || "Walk-in";

    const { error } = await supabase.from('orders').insert([
        { table_no: tableNo, items: cart.join(", "), status: 'pending' }
    ]);

    if(!error) {
        alert("Order Received! 🍽️");
        cart = [];
    }
}

// Filter Logic
function filter(cat) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    const filtered = cat === 'all' ? menuItems : menuItems.filter(i => i.cat === cat);
    renderMenu(filtered);
}

// Initial Load
renderMenu(menuItems);// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    
    // Timeline for synchronized animations
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.from(".navbar", { 
        y: -100, 
        duration: 1, 
        opacity: 0 
    })
    .from(".reveal", { 
        y: 50, 
        stagger: 0.2, 
        duration: 1.2, 
        opacity: 0,
        delay: -0.5 
    })
    .from(".glow-sphere", {
        scale: 0,
        duration: 1.5,
        opacity: 0,
        ease: "elastic.out(1, 0.3)"
    }, "-=1");

});