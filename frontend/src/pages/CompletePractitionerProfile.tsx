import { useUser } from '@clerk/react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';


export default function CompletePractitionerProfile() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    specialization: '',
    experienceYears: '',
    location: '',
    consultationFee: '',
    conditionsTreated: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const conditions = form.conditionsTreated.split(',').map(c => c.trim());

    await fetch('http://localhost:5000/api/practitioners/me',{
        method:"POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            specialization: form.specialization,
      practicingSinceEC: Number(form.experienceYears),
      location: form.location,
      consultationTypes: {
        chat: { enabled: true, price: Number(form.consultationFee) },
        audio: { enabled: false, price: 0 },
        video: { enabled: false, price: 0 },
      },
      conditionsTreated: conditions,
        }),
      
    });

    alert('Profile submitted! Waiting for admin approval.');
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-4xl font-bold text-green-700 mb-2">Complete Your Profile</h1>
      <p className="text-gray-600 mb-8">This will be reviewed by admin before you appear in the directory.</p>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow">
        <div>
          <label className="block font-medium mb-2">Specialization (e.g. Herbalist, Bone Setter)</label>
          <input type="text" required className="w-full p-3 border rounded-xl" 
                 onChange={e => setForm({...form, specialization: e.target.value})} />
        </div>

        <div>
          <label className="block font-medium mb-2">Years of Experience</label>
          <input type="number" required className="w-full p-3 border rounded-xl" 
                 onChange={e => setForm({...form, experienceYears: e.target.value})} />
        </div>

        <div>
          <label className="block font-medium mb-2">Location (e.g. Addis Ababa, Hawassa)</label>
          <input type="text" required className="w-full p-3 border rounded-xl" 
                 onChange={e => setForm({...form, location: e.target.value})} />
        </div>

        <div>
          <label className="block font-medium mb-2">Consultation Fee (ETB)</label>
          <input type="number" required className="w-full p-3 border rounded-xl" 
                 onChange={e => setForm({...form, consultationFee: e.target.value})} />
        </div>

        <div>
          <label className="block font-medium mb-2">Conditions Treated (comma separated)</label>
          <input type="text" placeholder="Diabetes, Hypertension, Skin issues" className="w-full p-3 border rounded-xl" 
                 onChange={e => setForm({...form, conditionsTreated: e.target.value})} />
        </div>

        <button type="submit" className="w-full py-4 bg-green-600 text-white rounded-2xl text-xl font-medium">
          Submit for Admin Review
        </button>
      </form>
    </div>
  );
}
