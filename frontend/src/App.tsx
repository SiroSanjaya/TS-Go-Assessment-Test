import { useState } from 'react';
import { PlaneTakeoff, Ticket, AlertCircle, CheckCircle2, User, Hash, Calendar, Plane } from 'lucide-react';
import { checkVouchers, generateVouchers } from './api';

function App() {
  const [formData, setFormData] = useState({
    crewName: '',
    crewId: '',
    flightNumber: '',
    flightDate: '',
    aircraftType: 'ATR'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seats, setSeats] = useState<string[] | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSeats(null);

    try {
      // 1. Check if vouchers exist
      const checkResult = await checkVouchers(formData.flightNumber, formData.flightDate);
      
      if (checkResult.exists) {
        setError(`Vouchers have already been generated for flight ${formData.flightNumber} on ${formData.flightDate}.`);
        setLoading(false);
        return;
      }

      // 2. Generate vouchers
      const generateResult = await generateVouchers({
        name: formData.crewName,
        id: formData.crewId,
        flightNumber: formData.flightNumber,
        date: formData.flightDate,
        aircraft: formData.aircraftType
      });

      if (generateResult.success) {
        setSeats(generateResult.seats);
      } else {
        setError(generateResult.error || 'Failed to generate vouchers.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An unexpected error occurred. Please make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl overflow-hidden grid md:grid-cols-2">
        {/* Left Side - Form */}
        <div className="p-8 lg:p-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <PlaneTakeoff size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">SkyVoucher</h1>
              <p className="text-sm text-slate-500 font-medium">Seat Assignment Portal</p>
            </div>
          </div>

          <form onSubmit={handleGenerate} className="space-y-5">
            <div className="space-y-4">
              {/* Crew Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Crew Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    name="crewName"
                    required
                    value={formData.crewName}
                    onChange={handleChange}
                    className="pl-10 w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter crew name"
                  />
                </div>
              </div>

              {/* Crew ID */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Crew ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Hash size={18} />
                  </div>
                  <input
                    type="text"
                    name="crewId"
                    required
                    value={formData.crewId}
                    onChange={handleChange}
                    className="pl-10 w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g. 98123"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Flight Number */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Flight Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Ticket size={18} />
                    </div>
                    <input
                      type="text"
                      name="flightNumber"
                      required
                      value={formData.flightNumber}
                      onChange={handleChange}
                      className="pl-10 w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all uppercase"
                      placeholder="GA102"
                    />
                  </div>
                </div>

                {/* Flight Date */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Flight Date</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Calendar size={18} />
                    </div>
                    <input
                      type="date"
                      name="flightDate"
                      required
                      value={formData.flightDate}
                      onChange={handleChange}
                      className="pl-10 w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Aircraft Type */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Aircraft Type</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Plane size={18} />
                  </div>
                  <select
                    name="aircraftType"
                    value={formData.aircraftType}
                    onChange={handleChange}
                    className="pl-10 w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                  >
                    <option value="ATR">ATR (Rows 1-18)</option>
                    <option value="Airbus 320">Airbus 320 (Rows 1-32)</option>
                    <option value="Boeing 737 Max">Boeing 737 Max (Rows 1-32)</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Generate Vouchers <Ticket size={18} /></>
              )}
            </button>
          </form>
        </div>

        {/* Right Side - Results Display */}
        <div className="bg-slate-900 p-8 lg:p-12 text-white flex flex-col justify-center relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

          <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col items-center text-center">
            {!seats && !error && (
              <div className="opacity-60 space-y-4">
                <Ticket size={48} className="mx-auto text-slate-400" />
                <p className="text-slate-300 font-medium">Fill in the flight details to generate winning voucher seats.</p>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl w-full">
                <AlertCircle size={32} className="mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-red-300 mb-1">Generation Failed</h3>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {seats && (
              <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-sm font-semibold border border-emerald-500/20">
                  <CheckCircle2 size={16} />
                  Successfully Generated
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-2">Winning Seats</h2>
                <p className="text-slate-400 text-sm">For Flight <span className="text-blue-400 font-semibold">{formData.flightNumber.toUpperCase()}</span> on {formData.flightDate}</p>

                <div className="grid grid-cols-1 gap-4 mt-8">
                  {seats.map((seat, idx) => (
                    <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center justify-between group hover:bg-white/15 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                          {idx + 1}
                        </div>
                        <div className="text-left">
                          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Seat Number</p>
                          <p className="text-2xl font-bold text-white tracking-tight">{seat}</p>
                        </div>
                      </div>
                      <Ticket className="text-slate-500 group-hover:text-amber-400 transition-colors" size={24} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
