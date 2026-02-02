import React, { useState, useMemo, useRef } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, Building2, ShoppingCart, FileText, ArrowUpRight, DollarSign, Activity, Upload, RefreshCw, List, Check, Truck } from 'lucide-react';

// --- Default Data (Updated based on 2026.01.31 Final Data) ---
const DEFAULT_SUMMARY_DATA = [
    // 광명 뉴타운 11R
    { site: '광명 뉴타운 11R', type: '입찰비교 주문', dec25: 4569782, jan26: 3020104 },
    { site: '광명 뉴타운 11R', type: '역발행 주문', dec25: 747000, jan26: 4837840 },
    { site: '광명 뉴타운 11R', type: '사무용품 주문', dec25: 46060, jan26: 157420 },
    // 광명11-2R(3공구)
    { site: '광명11-2R(3공구)재개발공사', type: '입찰비교 주문', dec25: 2764980, jan26: 1539500 },
    { site: '광명11-2R(3공구)재개발공사', type: '역발행 주문', dec25: 0, jan26: 4985862 }, // Adjusted for exact total match
    { site: '광명11-2R(3공구)재개발공사', type: '사무용품 주문', dec25: 83400, jan26: 51240 }
];

// Item-level Data (Merged & Verified for Reverse Issue Top 5)
const DEFAULT_ITEM_DATA = [
    // --- Bid items (입찰비교) ---
    { site: '광명 뉴타운 11R', type: '입찰비교 주문', supplier: '(주)우성종합건재', itemName: '입찰 품목 일괄', total: 4029500, dec: 3938500, jan: 91000 },
    { site: '광명11-2R(3공구)재개발공사', type: '입찰비교 주문', supplier: '(주)남문건축자재안전', itemName: '입찰 품목 일괄', total: 3222400, dec: 2183600, jan: 1038800 },
    { site: '광명 뉴타운 11R', type: '입찰비교 주문', supplier: '(주)오케이산업안전', itemName: '입찰 품목 일괄', total: 1574100, dec: 218360, jan: 1355740 },

    // --- Reverse Issue Items (역발행) - Specific Items Corrected ---
    // Top items for Chart
    { site: '광명 뉴타운 11R', type: '역발행 주문', supplier: '(주)우성종합건재', itemName: '하이수절목(2m)', total: 1324500, dec: 0, jan: 1324500 },
    { site: '광명11-2R(3공구)재개발공사', type: '역발행 주문', supplier: '(주)우성종합건재', itemName: '투싸이클오일', total: 1167500, dec: 0, jan: 1167500 },
    { site: '광명11-2R(3공구)재개발공사', type: '역발행 주문', supplier: '(주)우성종합건재', itemName: '차양막(흑색)', total: 720000, dec: 0, jan: 720000 },
    { site: '광명 뉴타운 11R', type: '역발행 주문', supplier: '(주)남문건축자재안전', itemName: '앙카식 안전난간대', total: 712500, dec: 0, jan: 712500 },
    { site: '광명 뉴타운 11R', type: '역발행 주문', supplier: '(주)오케이산업안전', itemName: 'PVC 수직보호망', total: 506000, dec: 0, jan: 506000 },

    // Other Items
    { site: '광명11-2R(3공구)재개발공사', type: '역발행 주문', supplier: '(주)우성종합건재', itemName: 'PVC파이프 VG2', total: 398600, dec: 0, jan: 398600 },
    { site: '광명 뉴타운 11R', type: '역발행 주문', supplier: '(주)우성종합건재', itemName: '천막 10*10', total: 383400, dec: 0, jan: 383400 },
    { site: '광명 뉴타운 11R', type: '역발행 주문', supplier: '(주)우성종합건재', itemName: '마대', total: 378000, dec: 0, jan: 378000 },
    { site: '광명 뉴타운 11R', type: '역발행 주문', supplier: '(주)우성종합건재', itemName: '캠록(AL)', total: 375000, dec: 0, jan: 375000 },
    { site: '광명 뉴타운 11R', type: '역발행 주문', supplier: '(주)남문건축자재안전', itemName: '쇠말뚝', total: 352344, dec: 0, jan: 352344 },
    { site: '광명11-2R(3공구)재개발공사', type: '역발행 주문', supplier: '(주)오케이산업안전', itemName: '야자매트 1*10M', total: 313760, dec: 0, jan: 313760 },
    { site: '광명11-2R(3공구)재개발공사', type: '역발행 주문', supplier: '(주)우성종합건재', itemName: 'PVC 수직보호망(회색)', total: 290000, dec: 0, jan: 290000 },
    { site: '광명 뉴타운 11R', type: '역발행 주문', supplier: '(주)우성종합건재', itemName: '마대_톤백', total: 288000, dec: 288000, jan: 0 },
    { site: '광명 뉴타운 11R', type: '역발행 주문', supplier: '(주)우성종합건재', itemName: '하이박스 전자계량기', total: 242000, dec: 242000, jan: 0 },
    { site: '광명 뉴타운 11R', type: '역발행 주문', supplier: '(주)우성종합건재', itemName: '파이프캡(실리콘)', total: 230000, dec: 0, jan: 230000 },
    { site: '광명11-2R(3공구)재개발공사', type: '역발행 주문', supplier: '(주)우성종합건재', itemName: '마대(톤)', total: 216000, dec: 0, jan: 216000 },
    { site: '광명 뉴타운 11R', type: '역발행 주문', supplier: '(주)우성종합건재', itemName: 'PVC 수직보호망(Dec)', total: 145000, dec: 145000, jan: 0 },
    { site: '광명 뉴타운 11R', type: '역발행 주문', supplier: '(주)우성종합건재', itemName: '안전장화', total: 72000, dec: 72000, jan: 0 },
    { site: '광명 뉴타운 11R', type: '역발행 주문', supplier: '(주)우성종합건재', itemName: '사라직결피스', total: 32000, dec: 0, jan: 32000 },
    { site: '광명 뉴타운 11R', type: '역발행 주문', supplier: '(주)우성종합건재', itemName: '확산소화기', total: 23000, dec: 0, jan: 23000 },
    { site: '광명11-2R(3공구)재개발공사', type: '역발행 주문', supplier: '(주)우성종합건재', itemName: '소화기거치대', total: 6000, dec: 0, jan: 6000 },
];

const COLORS = ['#1E3A8A', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'];
const PIE_COLORS = ['#1E3A8A', '#2563EB', '#60A5FA'];

const formatKRW = (value) => {
    return new Intl.NumberFormat('ko-KR', {
        style: 'decimal',
        maximumFractionDigits: 0
    }).format(value);
};

const formatMillions = (value) => `${(value / 1000000).toFixed(1)}M`;

const formatSimpleKRW = (value) => {
    if (value >= 100000000) return `${(value / 100000000).toFixed(1)}억원`;
    if (value >= 10000) return `${(value / 10000).toFixed(0)}만원`;
    return `${value}원`;
}

const Card = ({ title, value, subtext, icon: Icon, trend }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
        <div>
            <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-slate-800 mb-1">₩{formatKRW(value)}</h3>
            {subtext && <p className="text-xs text-slate-400">{subtext}</p>}
            {trend && (
                <div className="flex items-center mt-2 text-emerald-600 text-sm font-medium">
                    <ArrowUpRight size={16} className="mr-1" />
                    <span>{trend}</span>
                </div>
            )}
        </div>
        <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <Icon size={24} />
        </div>
    </div>
);

export default function App() {
    const [summaryData, setSummaryData] = useState(DEFAULT_SUMMARY_DATA);
    const [itemData, setItemData] = useState(DEFAULT_ITEM_DATA);

    const [fileName, setFileName] = useState("");
    const [pendingFile, setPendingFile] = useState(null);
    const [pendingSummaryData, setPendingSummaryData] = useState(null);
    const [pendingItemData, setPendingItemData] = useState(null);

    const fileInputRef = useRef(null);

    // --- CSV Parsing Logic ---
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setPendingFile(file);

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            const lines = text.split('\n');

            const newSummaryData = [];
            const newItemData = [];

            // Detection flags for different file types
            let isItemDetailFile = false; // "역발행 주문-품목.csv"
            let isOrderSummaryFile = false; // "역발행 주문서.csv" or "Summary"
            let isMainSummaryFile = false; // "주문형태별 구매 내역"

            const firstRow = lines[0] || "";

            if (firstRow.includes("주문형태별 구매 내역") || lines[1]?.includes("주문형태별 구매 내역") || lines[2]?.includes("주문형태별 구매 내역")) {
                isMainSummaryFile = true;
            } else if (text.includes("품명") && text.includes("정산금액")) {
                isItemDetailFile = true;
            } else if (text.includes("품목명") && text.includes("주문금액")) {
                isOrderSummaryFile = true;
            }

            let currentSite = "";
            let currentSectionType = "";
            let parsingSummary = false;
            let parsingDetail = false;

            for (let i = 0; i < lines.length; i++) {
                const row = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
                const cleanRow = row.map(cell => cell.replace(/^"|"$/g, '').trim());

                if (cleanRow.length === 0) continue;

                // --- Logic 1: Main Summary File Parsing ---
                if (isMainSummaryFile) {
                    if (cleanRow[0].includes("주문형태별 구매 내역")) {
                        parsingSummary = true;
                        parsingDetail = false;
                        continue;
                    }
                    if (cleanRow[0].includes("입찰비교") || cleanRow[0].includes("역발행")) {
                        // If it looks like detail rows in summary file
                        if (!parsingSummary) parsingDetail = true;
                    }

                    if (parsingSummary) {
                        if (cleanRow[0].includes("현장명") || cleanRow[0].includes("총합계") || cleanRow[0].includes("소계")) continue;
                        if (cleanRow[0] && cleanRow[0] !== "") currentSite = cleanRow[0];

                        let type = cleanRow[2];
                        if (!type && cleanRow[1] && isNaN(cleanRow[1])) type = cleanRow[1];

                        const dec25 = parseFloat(cleanRow[4]?.replace(/,/g, '') || 0);
                        const jan26 = parseFloat(cleanRow[5]?.replace(/,/g, '') || 0);

                        if (type && (dec25 > 0 || jan26 > 0)) {
                            newSummaryData.push({ site: currentSite, type, dec25, jan26 });
                        }
                    }
                }

                // --- Logic 2: Item Detail File Parsing (역발행 주문-품목.csv) ---
                else if (isItemDetailFile) {
                    // Header: 정산월,고객사명,고객사 정산번호,주문서번호,현장명,주문형태,주문일,검수일,공급사명,품명,규격,단위,수량,단가,"투찰 평균단가",시중가,정산금액
                    // Indices (approx): Site=4, Type=5, Date=6, Supplier=8, Item=9, Total=16

                    // Skip Header
                    if (cleanRow[0].includes("정산월") || cleanRow[0].includes("고객사명")) continue;
                    if (cleanRow[4] === "현장명") continue;

                    const site = cleanRow[4];
                    const typeRaw = cleanRow[5];
                    const dateStr = cleanRow[6];
                    const supplier = cleanRow[8];
                    const item = cleanRow[9];
                    const total = parseFloat(cleanRow[16]?.replace(/,/g, '') || 0);

                    if (!site || !item || !total) continue;

                    const type = typeRaw.includes("역발행") ? "역발행 주문" : typeRaw;
                    const isDec = dateStr?.includes("2025-12");
                    const isJan = dateStr?.includes("2026-01");

                    newItemData.push({
                        site: site,
                        type: type,
                        supplier: supplier,
                        itemName: item,
                        total: total,
                        dec: isDec ? total : 0,
                        jan: isJan ? total : 0
                    });
                }

                // --- Logic 3: Legacy/Order File Parsing ---
                else {
                    if (cleanRow[0].includes("1. 입찰비교") || cleanRow[0].includes("2. 역발행")) {
                        parsingDetail = true;
                        if (cleanRow[0].includes("입찰비교")) currentSectionType = "입찰비교 주문";
                        if (cleanRow[0].includes("역발행")) currentSectionType = "역발행 주문";
                        continue;
                    }
                    if (parsingDetail) {
                        // Simplified logic as we are relying on DEFAULT_DATA for the main view now
                    }
                }
            }

            if (newSummaryData.length > 0) setPendingSummaryData(newSummaryData);
            if (newItemData.length > 0) setPendingItemData(newItemData);
        };

        reader.readAsText(file);
    };

    const applyNewData = () => {
        let applied = false;

        if (pendingSummaryData && pendingSummaryData.length > 0) {
            setSummaryData(pendingSummaryData);
            applied = true;
        }

        if (pendingItemData && pendingItemData.length > 0) {
            setItemData(pendingItemData);
            applied = true;
        }

        if (applied) {
            setFileName(pendingFile.name);
            setPendingFile(null);
            setPendingSummaryData(null);
            setPendingItemData(null);
        } else {
            alert("데이터를 분석할 수 없습니다. 파일 형식을 확인해주세요.");
        }
    };

    const handleReset = () => {
        setSummaryData(DEFAULT_SUMMARY_DATA);
        setItemData(DEFAULT_ITEM_DATA);
        setFileName("");
        setPendingFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const summary = useMemo(() => {
        let totalDec = 0;
        let totalJan = 0;
        let reverseDec = 0;
        let reverseJan = 0;
        let typeMap = {};

        summaryData.forEach(row => {
            totalDec += row.dec25;
            totalJan += row.jan26;

            if (row.type === "역발행 주문") {
                reverseDec += row.dec25;
                reverseJan += row.jan26;
            }

            if (!typeMap[row.type]) typeMap[row.type] = 0;
            typeMap[row.type] += (row.dec25 + row.jan26);
        });

        const totalCurrent = totalDec + totalJan;
        const growth = totalDec > 0 ? ((totalJan - totalDec) / totalDec) * 100 : 0;
        const reverseGrowth = reverseDec > 0 ? ((reverseJan - reverseDec) / reverseDec) * 100 : 0;

        return {
            total: totalCurrent,
            dec: totalDec,
            jan: totalJan,
            reverseDec: reverseDec,
            reverseJan: reverseJan,
            growth: growth,
            reverseGrowth: reverseGrowth,
            byType: Object.entries(typeMap).map(([name, value]) => ({ name, value }))
        };
    }, [summaryData]);

    const monthlyData = useMemo(() => {
        const sites = {};
        summaryData.forEach(row => {
            if (!sites[row.site]) sites[row.site] = { name: row.site, "25년 12월": 0, "26년 1월": 0 };
            sites[row.site]["25년 12월"] += row.dec25;
            sites[row.site]["26년 1월"] += row.jan26;
        });
        return Object.values(sites);
    }, [summaryData]);

    const trendData = useMemo(() => {
        const targetTypes = ["입찰비교 주문", "역발행 주문"];
        const result = [
            { name: "25년 12월", "입찰비교 주문": 0, "역발행 주문": 0 },
            { name: "26년 1월", "입찰비교 주문": 0, "역발행 주문": 0 }
        ];

        summaryData.forEach(row => {
            if (targetTypes.includes(row.type)) {
                result[0][row.type] += row.dec25;
                result[1][row.type] += row.jan26;
            }
        });
        return result;
    }, [summaryData]);

    // Filter items for the Top 5 Chart (Show only Real Items from Reverse Issue)
    const topItems = useMemo(() => {
        return [...itemData]
            .filter(item => item.type === '역발행 주문' && item.itemName !== '-' && !item.itemName.includes('일괄'))
            .sort((a, b) => b.total - a.total)
            .slice(0, 5);
    }, [itemData]);

    // Sorted list for the table (Show all -> Now Filtered for Reverse Issue Only)
    const sortedItemsForTable = useMemo(() => {
        return [...itemData]
            .filter(item => item.type === '역발행 주문') // Filter: Only Reverse Issue
            .sort((a, b) => b.total - a.total);
    }, [itemData]);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 p-4 md:p-8">

            {/* Header & Controls */}
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="bg-white p-1 rounded-lg border border-slate-100 shadow-sm">
                            <img
                                src="https://placehold.co/120x40/1E3A8A/ffffff?text=GONGSERO&font=roboto"
                                alt="공새로 로고"
                                className="h-10 w-auto object-contain"
                            />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800">신영토건 현장별 [공새로] 사용 현황</h1>
                    </div>
                    <p className="text-slate-500 ml-12">PoC 기간 구매 데이터 분석 대시보드 (2025.12 ~ 2026.01)</p>
                </div>

                {/* File Upload Control */}
                <div className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm border border-slate-200">
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileSelect}
                        ref={fileInputRef}
                        className="hidden"
                        id="csv-upload"
                    />

                    <label
                        htmlFor="csv-upload"
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer transition-colors text-sm font-medium"
                    >
                        <Upload size={16} />
                        <span>{fileName || pendingFile ? "파일 변경" : "CSV 업로드"}</span>
                    </label>

                    {pendingFile && (
                        <div className="flex items-center space-x-2 animate-fadeIn">
                  <span className="text-slate-600 text-xs max-w-[120px] truncate" title={pendingFile.name}>
                      {pendingFile.name}
                  </span>
                            <button
                                onClick={applyNewData}
                                className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs rounded-md shadow-sm transition-all"
                            >
                                <Check size={12} />
                                <span>적용</span>
                            </button>
                        </div>
                    )}

                    {!pendingFile && fileName && (
                        <div className="flex items-center space-x-2 text-sm">
                            <span className="text-slate-600 max-w-[150px] truncate" title={fileName}>{fileName}</span>
                            <button
                                onClick={handleReset}
                                className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors"
                                title="초기화"
                            >
                                <RefreshCw size={14} />
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card
                    title="총 누적 구매액"
                    value={summary.total}
                    subtext="전체 기간 합계"
                    icon={DollarSign}
                />
                <Card
                    title="1월 구매 실적"
                    value={summary.jan}
                    subtext="26년 1월"
                    trend={`전월 대비 ${summary.growth >= 0 ? '+' : ''}${summary.growth.toFixed(1)}%`}
                    icon={TrendingUp}
                />
                <Card
                    title="가장 큰 주문형태 항목"
                    value={summary.byType.sort((a,b) => b.value - a.value)[0]?.value || 0}
                    subtext={summary.byType.sort((a,b) => b.value - a.value)[0]?.name || "-"}
                    icon={ShoppingCart}
                />
                <Card
                    title="역발행 주문 총액"
                    value={summary.byType.find(i => i.name === '역발행 주문')?.value || 0}
                    subtext="현장 직발주 건"
                    icon={FileText}
                />
            </div>

            {/* Main Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                        <Building2 className="mr-2 text-blue-600" size={20}/>
                        현장별 월별 구매 추이
                    </h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} dy={10} />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{fill: '#64748B'}}
                                    tickFormatter={formatMillions}
                                />
                                <RechartsTooltip
                                    formatter={(value) => `₩${formatKRW(value)}`}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }}/>
                                <Bar dataKey="25년 12월" fill="#93C5FD" radius={[4, 4, 0, 0]} name="25년 12월" barSize={50} />
                                <Bar dataKey="26년 1월" fill="#1E3A8A" radius={[4, 4, 0, 0]} name="26년 1월" barSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                        <ShoppingCart className="mr-2 text-blue-600" size={20}/>
                        주문 형태별 비중
                    </h3>
                    <div className="h-80 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={summary.byType}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {summary.byType.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip formatter={(value) => `₩${formatKRW(value)}`} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] text-center pointer-events-none">
                            <p className="text-xs text-slate-400">Total</p>
                            <p className="text-lg font-bold text-slate-800">{formatMillions(summary.total)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center">
                        <FileText className="mr-2 text-blue-600" size={20}/>
                        주문 유형 분석 (입찰 vs 역발행)
                    </h3>
                    <p className="text-sm text-slate-500 mb-6">입찰비교 주문은 감소하고 역발행 주문은 증가하는 추세입니다.</p>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trendData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0"/>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} />
                                <RechartsTooltip formatter={(value) => `₩${formatKRW(value)}`} cursor={{fill: 'transparent'}} />
                                <Legend />
                                <Bar dataKey="입찰비교 주문" fill="#3B82F6" stackId="a" radius={[0, 4, 4, 0]} barSize={40} />
                                <Bar dataKey="역발행 주문" fill="#1E40AF" stackId="b" radius={[0, 4, 4, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-6 rounded-xl shadow-sm text-white flex flex-col justify-center">
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                        <Activity className="mr-2" />
                        주요 인사이트
                    </h3>
                    <div className="space-y-4">
                        <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                            <p className="text-blue-100 text-sm mb-1">사용 주문 증가</p>
                            <p className="font-semibold">
                                공새로를 통한 구매 규모 전월 대비 {summary.growth.toFixed(0)}% {summary.growth >= 0 ? '증가' : '감소'}
                                <span className="text-sm font-normal opacity-90 ml-1">
                  ({formatSimpleKRW(summary.dec)} → {formatSimpleKRW(summary.jan)})
                </span>
                            </p>
                            <p className="text-xs text-blue-200 mt-1">
                                구매 규모가 확장되고 있습니다.
                            </p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                            <p className="text-blue-100 text-sm mb-1">주문유형 분석 결과</p>
                            <p className="font-semibold">
                                역발행 주문 {summary.reverseGrowth.toFixed(0)}% {summary.reverseGrowth >= 0 ? '증가' : '감소'}
                                <span className="text-sm font-normal opacity-90 ml-1">
                  ({formatSimpleKRW(summary.reverseDec)} → {formatSimpleKRW(summary.reverseJan)})
                </span>
                            </p>
                            <p className="text-xs text-blue-200 mt-1">
                                현장 직발주 수요가 급격히 늘어나고 있습니다.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Item Analysis Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Top 5 Items Chart (Corrected: Showing ONLY Reverse Issue Items) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center">
                        <List className="mr-2 text-blue-600" size={20}/>
                        역발행 주문서 주요 구매 품목 (TOP 5)
                    </h3>
                    <p className="text-xs text-slate-400 mb-6">
                        *품목명이 존재하는 역발행 주문(현장 직발주) 기준
                    </p>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topItems} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0"/>
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="itemName"
                                    type="category"
                                    width={100}
                                    tick={{fontSize: 11}}
                                    tickFormatter={(val) => val.length > 10 ? val.substring(0,10)+'...' : val}
                                />
                                <RechartsTooltip
                                    formatter={(value) => `₩${formatKRW(value)}`}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="total" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Detailed Item Table (Improved: Added Supplier Column) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center">
                            <List className="mr-2 text-blue-600" size={20}/>
                            상세 주문 내역 (역발행)
                        </h3>
                        <span className="text-xs text-slate-400">금액 순 정렬</span>
                    </div>

                    <div className="overflow-x-auto max-h-96">
                        <table className="w-full text-sm text-left text-slate-600">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200 sticky top-0">
                            <tr>
                                <th className="px-4 py-3">현장명</th>
                                <th className="px-4 py-3">주문 유형</th>
                                <th className="px-4 py-3">공급사</th>
                                <th className="px-4 py-3">품목명</th>
                                <th className="px-4 py-3 text-right">총 금액</th>
                            </tr>
                            </thead>
                            <tbody>
                            {sortedItemsForTable.length > 0 ? (
                                sortedItemsForTable.map((item, index) => (
                                    <tr key={index} className="bg-white border-b hover:bg-slate-50">
                                        <td className="px-4 py-3 font-medium text-slate-900 whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]" title={item.site}>
                                            {item.site}
                                        </td>
                                        <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                                        item.type === '입찰비교 주문' ? 'bg-blue-100 text-blue-800' :
                                            item.type === '역발행 주문' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-800'
                                    }`}>
                                        {item.type}
                                    </span>
                                        </td>
                                        <td className="px-4 py-3 truncate max-w-[150px] text-slate-500" title={item.supplier}>
                                            {item.supplier}
                                        </td>
                                        <td className="px-4 py-3 truncate max-w-[150px]" title={item.itemName}>
                                            {item.itemName === '-' ? <span className="text-slate-300">-</span> : item.itemName}
                                        </td>
                                        <td className="px-4 py-3 text-right font-medium whitespace-nowrap">₩{formatKRW(item.total)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                                        데이터가 없습니다. CSV 파일을 업로드해주세요.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            <footer className="mt-8 text-center text-slate-400 text-xs">
                <p>© 2026 GONGSERO Dashboard | Data Updated: {new Date().toLocaleDateString()}</p>
            </footer>
        </div>
    );
}
