import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Home, HeartHandshake, Building2, ChevronLeft, MapPin, ChevronRight, User } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { api } from '../services/api';
import { locationData } from '../data/locations';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";

import { Badge } from "./ui/badge";
import { Input } from "./ui/input";

interface ComponentData {
    name: string;
    implementing: number;
    executing: number;
}


export function Mapping() {
    const [data, setData] = useState<ComponentData[]>([
        { name: 'Adarsh Gram', implementing: 0, executing: 0 },
        { name: 'GIA', implementing: 0, executing: 0 },
        { name: 'Hostel', implementing: 0, executing: 0 },
    ]);
    const [loading, setLoading] = useState(true);
    const [selectedView, setSelectedView] = useState<'dashboard' | 'Adarsh Gram' | 'GIA' | 'Hostel'>('dashboard');

    // Hierarchical Selection State
    const [selectedState, setSelectedState] = useState<string>('');
    const [selectedDistrict, setSelectedDistrict] = useState<string>('');
    const [selectedVillage, setSelectedVillage] = useState<string>('');
    const [filteredAgencies, setFilteredAgencies] = useState<any[]>([]);
    const [allAgencies, setAllAgencies] = useState<any[]>([]);

    useEffect(() => {
        const fetchAgencies = async () => {
            try {
                const agencies = await api.agencies.getAll();
                setAllAgencies(agencies);

                const newData = [
                    { name: 'Adarsh Gram', implementing: 0, executing: 0 },
                    { name: 'GIA', implementing: 0, executing: 0 },
                    { name: 'Hostel', implementing: 0, executing: 0 },
                ];

                agencies.forEach(agency => {
                    const role = agency.roleType; // 'Implementing' | 'Executing'
                    const components = agency.components || [];

                    components.forEach(comp => {
                        // Handle potential case mismatches or whitespace
                        const normalizedComp = comp.trim();
                        const dataIndex = newData.findIndex(d => d.name === normalizedComp);

                        if (dataIndex !== -1) {
                            if (role === 'Implementing') {
                                newData[dataIndex].implementing += 1;
                            } else if (role === 'Executing') {
                                newData[dataIndex].executing += 1;
                            }
                        }
                    });
                });

                setData(newData);
            } catch (error) {
                console.error("Failed to fetch agencies", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAgencies();
    }, []);

    // Filter agencies based on selection
    useEffect(() => {
        if (selectedView !== 'dashboard') {
            let filtered = allAgencies.filter(a => (a.components || []).includes(selectedView));

            if (selectedState) {
                filtered = filtered.filter(a => a.state === selectedState);
            }
            if (selectedDistrict) {
                filtered = filtered.filter(a => a.district === selectedDistrict);
            }
            if (selectedVillage && selectedVillage.trim() !== '') {
                const searchTerm = selectedVillage.toLowerCase().trim();
                filtered = filtered.filter(a =>
                    (a.village || '').toLowerCase().includes(searchTerm) ||
                    (a.address || '').toLowerCase().includes(searchTerm)
                );
            }

            setFilteredAgencies(filtered);
        }
    }, [selectedView, selectedState, selectedDistrict, selectedVillage, allAgencies]);

    const getData = (name: string) => data.find(d => d.name === name) || { implementing: 0, executing: 0 };
    const states = Object.keys(locationData);
    const districts = selectedState ? locationData[selectedState] || [] : [];

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading dashboard data...</div>;
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header Section */}
            <div className="bg-white border-b pt-8 pb-6 px-4 text-center">
                <h1 className="text-6xl font-extrabold text-green-700 mb-4">PM-AJAY Agency Mapping</h1>
                <p className="text-lg text-gray-700 font-medium">Streamlining Implementation for Adarsh Gram, GIA, and Hostel Components</p>
                <p className="text-gray-600">Ministry of Social Justice & Empowerment (MoSJE)</p>
                <p className="text-sm text-gray-500 mt-2 max-w-2xl mx-auto">
                    Centralized mapping to reduce delays, enhance coordination, and ensure accountability.
                </p>
            </div>


            <div className="p-8 max-w-7xl mx-auto space-y-8">


                {/* Component Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Adarsh Gram Card */}
                    <Card
                        className={`bg-green-50 border-green-100 hover:shadow-md transition-shadow cursor-pointer ${selectedView === 'Adarsh Gram' ? 'ring-2 ring-green-500' : ''}`}
                        onClick={() => setSelectedView('Adarsh Gram')}
                    >
                        <CardContent className="p-6 text-center space-y-4">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto text-white shadow-lg">
                                <Home size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 flex items-center justify-center gap-2">
                                    Adarsh Gram
                                    <ChevronRight size={16} className="text-green-700" />
                                </h3>
                                <p className="text-sm text-gray-600 mt-2 min-h-[40px]">
                                    Focus: Village development. Implementing: {getData('Adarsh Gram').implementing}. Executing: {getData('Adarsh Gram').executing} agencies
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* GIA Card */}
                    <Card
                        className={`bg-cyan-50 border-cyan-100 hover:shadow-md transition-shadow cursor-pointer ${selectedView === 'GIA' ? 'ring-2 ring-cyan-500' : ''}`}
                        onClick={() => setSelectedView('GIA')}
                    >
                        <CardContent className="p-6 text-center space-y-4">
                            <div className="w-16 h-16 bg-cyan-400 rounded-full flex items-center justify-center mx-auto text-white shadow-lg">
                                <HeartHandshake size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 flex items-center justify-center gap-2">
                                    GIA
                                    <ChevronRight size={16} className="text-cyan-700" />
                                </h3>
                                <p className="text-sm text-gray-600 mt-2 min-h-[40px]">
                                    Focus: Grants-in-Aid. Implementing: {getData('GIA').implementing}. Executing: {getData('GIA').executing} agencies
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Hostel Card */}
                    <Card
                        className={`bg-orange-50 border-orange-100 hover:shadow-md transition-shadow cursor-pointer ${selectedView === 'Hostel' ? 'ring-2 ring-amber-500' : ''}`}
                        onClick={() => setSelectedView('Hostel')}
                    >
                        <CardContent className="p-6 text-center space-y-4">
                            <div className="w-16 h-16 bg-amber-400 rounded-full flex items-center justify-center mx-auto text-white shadow-lg">
                                <Building2 size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 flex items-center justify-center gap-2">
                                    Hostel
                                    <ChevronRight size={16} className="text-amber-700" />
                                </h3>
                                <p className="text-sm text-gray-600 mt-2 min-h-[40px]">
                                    Focus: Hostel infrastructure. Implementing: {getData('Hostel').implementing}. Executing: {getData('Hostel').executing} agencies
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Drill-down Tree View */}
                {/* Stacked Hierarchy View */}
                {selectedView !== 'dashboard' && (
                    <div className="space-y-6 mt-8 border-t pt-8">
                        <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-100">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{selectedView} Mapping Structure</h1>
                                <p className="text-gray-500">Hierarchy View</p>
                            </div>
                            <Button variant="outline" onClick={() => setSelectedView('dashboard')}>
                                Close View
                            </Button>
                        </div>

                        <div className="flex flex-col gap-4 p-6 bg-gray-50 rounded-xl border border-gray-200">
                            {/* Level 1: MoSJE */}
                            <div className="w-full">
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 w-full">
                                    <h3 className="font-bold text-gray-800">MoSJE (Central Ministry)</h3>
                                </div>
                            </div>

                            {/* Level 2: Component */}
                            <div className="w-full">
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 w-full">
                                    <h3 className="font-bold text-gray-800">{selectedView}</h3>
                                    <p className="text-xs text-gray-500">
                                        {selectedView === 'Adarsh Gram' && 'Infrastructure & Development'}
                                        {selectedView === 'GIA' && 'Welfare Programs'}
                                        {selectedView === 'Hostel' && 'Construction / Hostels'}
                                    </p>
                                </div>
                            </div>

                            {/* Level 3: Central PMU */}
                            <div className="w-full">
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 w-full">
                                    <h3 className="font-bold text-gray-800">Central PMU</h3>
                                </div>
                            </div>

                            {/* Level 4: State */}
                            <div className="w-full">
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 w-full">
                                    <h3 className="font-bold text-gray-800 mb-2">State Dept / SNO</h3>
                                    <Select value={selectedState} onValueChange={(v) => { setSelectedState(v); setSelectedDistrict(''); }}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select State" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Level 5: District */}
                            <div className="w-full">
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 w-full">
                                    <h3 className="font-bold text-gray-800 mb-2">
                                        {selectedView === 'Adarsh Gram' ? 'District Officer / DNO' :
                                            selectedView === 'GIA' ? 'District Welfare Office' : 'District Collector + PWD'}
                                    </h3>
                                    <Select value={selectedDistrict} onValueChange={setSelectedDistrict} disabled={!selectedState}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select District" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {districts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Level 6: Village */}
                            <div className="w-full">
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 w-full">
                                    <h3 className="font-bold text-gray-800 mb-2">Village / Location</h3>
                                    <Input
                                        placeholder="Enter Village Name"
                                        value={selectedVillage}
                                        onChange={(e) => setSelectedVillage(e.target.value)}
                                        disabled={!selectedDistrict}
                                    />
                                </div>
                            </div>

                            {/* Level 7: Agencies (Results) */}
                            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                {/* Implementing Agencies */}
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 w-full flex flex-col h-full">
                                    <h3 className="font-bold text-green-700 mb-4 flex items-center gap-2 pb-2 border-b border-green-100">
                                        <Building2 size={20} /> Implementing Agencies
                                    </h3>
                                    {filteredAgencies.filter(a => a.roleType === 'Implementing').length === 0 ? (
                                        <div className="text-gray-500 text-sm italic py-4 text-center bg-gray-50 rounded-lg">No implementing agencies found.</div>
                                    ) : (
                                        <div className="space-y-4">
                                            {filteredAgencies.filter(a => a.roleType === 'Implementing').map((agency: any) => (
                                                <div key={agency.id} className="p-4 border rounded-lg hover:shadow-md transition-all bg-white border-l-4 border-l-green-500">
                                                    <div className="flex justify-between items-start gap-2 mb-2">
                                                        <h4 className="font-bold text-gray-900 text-base">{agency.name}</h4>
                                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 whitespace-nowrap">
                                                            {agency.category || 'Govt Body'}
                                                        </Badge>
                                                    </div>

                                                    <div className="space-y-2 text-sm text-gray-600">
                                                        <div className="flex items-start gap-2">
                                                            <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                                                            <div>
                                                                <span className="font-medium text-gray-900">State:</span> {agency.state}
                                                            </div>
                                                        </div>
                                                        {agency.address && (
                                                            <div className="flex items-start gap-2 pl-6">
                                                                <span className="text-xs text-gray-500">{agency.address}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Executing Agencies */}
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 w-full flex flex-col h-full">
                                    <h3 className="font-bold text-blue-700 mb-4 flex items-center gap-2 pb-2 border-b border-blue-100">
                                        <User size={20} /> Executing Agencies
                                    </h3>
                                    {filteredAgencies.filter(a => a.roleType === 'Executing').length === 0 ? (
                                        <div className="text-gray-500 text-sm italic py-4 text-center bg-gray-50 rounded-lg">No executing agencies found.</div>
                                    ) : (
                                        <div className="space-y-4">
                                            {filteredAgencies.filter(a => a.roleType === 'Executing').map((agency: any) => (
                                                <div key={agency.id} className="p-4 border rounded-lg hover:shadow-md transition-all bg-white border-l-4 border-l-blue-500">
                                                    <div className="flex justify-between items-start gap-2 mb-2">
                                                        <h4 className="font-bold text-gray-900 text-base">{agency.name}</h4>
                                                        <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 whitespace-nowrap">
                                                            {agency.category || 'NGO/VO'}
                                                        </Badge>
                                                    </div>

                                                    <div className="space-y-2 text-sm text-gray-600">
                                                        <div className="flex items-start gap-2">
                                                            <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                                                            <div>
                                                                <span className="font-medium text-gray-900">Location:</span> {agency.district}
                                                                {agency.village && <span className="text-gray-500">, {agency.village}</span>}
                                                            </div>
                                                        </div>
                                                        {agency.address && (
                                                            <div className="flex items-start gap-2 pl-6">
                                                                <span className="text-xs text-gray-500">{agency.address}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center gap-2 pl-6 pt-1">
                                                            <Badge variant="secondary" className="text-xs font-normal">
                                                                {selectedView}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
