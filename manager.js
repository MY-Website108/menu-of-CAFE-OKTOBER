const supabaseUrl = "YOUR_URL";
const supabaseKey = "YOUR_KEY";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

async function loadOrders() {
    const { data } = await supabase.from('orders').select('*').neq('status', 'done');
    document.getElementById('order-list').innerHTML = data.map(o => `
        <div class="mgr-card">
            <strong>Table ${o.table_no}</strong>: ${o.items}
            <button onclick="markDone('${o.id}')">Serve</button>
        </div>
    `).join('');
}

async function markDone(id) {
    await supabase.from('orders').update({ status: 'done' }).eq('id', id);
    loadOrders();
}

async function updateEvent() {
    const title = document.getElementById('evTitle').value;
    const date = document.getElementById('evDate').value;
    const desc = document.getElementById('evDesc').value;

    await supabase.from('events').insert([{ title, date, description: desc }]);
    alert("Event Posted!");
}

// Live Update for Orders
supabase.channel('custom-all-channel')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, payload => {
      loadOrders();
  }).subscribe();

loadOrders();

// ... existing Supabase config ...

async function updateEvent() {
    const title = document.getElementById('evTitle').value;
    const date = document.getElementById('evDate').value;
    const desc = document.getElementById('evDesc').value;

    if(!title || !date) return alert("Fill in details");

    const { error } = await supabase.from('events').insert([{ title, date, description: desc }]);
    
    if(!error) {
        alert("Board Updated!");
        // Clear inputs
        document.getElementById('evTitle').value = "";
        document.getElementById('evDate').value = "";
        document.getElementById('evDesc').value = "";
    }
}