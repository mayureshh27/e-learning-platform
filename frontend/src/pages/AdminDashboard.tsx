import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getFilteredRowModel,
    type Table,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
    Plus,
    Search,
    Users,
    BookOpen,
    TrendingUp,
    Loader2,
    Edit,
    Trash2,
    GraduationCap,
} from 'lucide-react';
import { useAdminCourses, useAdminUsers, useAdminEnrollments, useAdminReports } from '@/hooks/useAdmin';
import { useDeleteCourse } from '@/hooks/useCourses';
import { CreateCourseModal } from '@/components/admin/CreateCourseModal';
import type { Course, User, Enrollment } from '@/types/api.types';

// Tab type
type TabType = 'courses' | 'users' | 'enrollments';

// Column helpers
const courseColumnHelper = createColumnHelper<Course>();
const userColumnHelper = createColumnHelper<User>();
const enrollmentColumnHelper = createColumnHelper<Enrollment>();

// Course columns
const courseColumns = [
    courseColumnHelper.accessor('title', {
        header: 'Course Title',
        cell: (info) => <span className="font-bold text-white">{info.getValue()}</span>,
    }),
    courseColumnHelper.accessor('category', {
        header: 'Category',
        cell: (info) => <span className="text-zinc-400 capitalize">{info.getValue()}</span>,
    }),
    courseColumnHelper.accessor('level', {
        header: 'Level',
        cell: (info) => {
            const level = info.getValue();
            const colors = {
                beginner: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
                intermediate: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
                advanced: 'bg-red-500/10 text-red-500 border-red-500/20',
            };
            return (
                <span className={`px-2 py-1 rounded text-xs font-mono border capitalize ${colors[level]}`}>
                    {level}
                </span>
            );
        },
    }),
    courseColumnHelper.accessor('isPublished', {
        header: 'Status',
        cell: (info) => {
            const published = info.getValue();
            return (
                <span
                    className={`px-2 py-1 rounded text-xs font-mono border ${published
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
                        }`}
                >
                    {published ? 'Published' : 'Draft'}
                </span>
            );
        },
    }),
    courseColumnHelper.accessor('price', {
        header: 'Price',
        cell: (info) => (
            <span className="font-mono text-violet-400">${info.getValue()?.toFixed(2) || '0.00'}</span>
        ),
    }),
    courseColumnHelper.accessor('modules', {
        header: 'Modules',
        cell: (info) => info.getValue()?.length || 0,
    }),
];

// User columns
const userColumns = [
    userColumnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => <span className="font-bold text-white">{info.getValue()}</span>,
    }),
    userColumnHelper.accessor('email', {
        header: 'Email',
        cell: (info) => <span className="text-zinc-400">{info.getValue()}</span>,
    }),
    userColumnHelper.accessor('role', {
        header: 'Role',
        cell: (info) => {
            const role = info.getValue();
            const colors = {
                admin: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
                user: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
                instructor: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
            };
            return (
                <span className={`px-2 py-1 rounded text-xs font-mono border capitalize ${colors[role]}`}>
                    {role}
                </span>
            );
        },
    }),
    userColumnHelper.accessor('createdAt', {
        header: 'Joined',
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    }),
];

// Enrollment columns
const enrollmentColumns = [
    enrollmentColumnHelper.accessor('user', {
        header: 'User',
        cell: (info) => {
            const user = info.getValue();
            return (
                <span className="font-bold text-white">
                    {typeof user === 'object' && user ? (user as User).name : String(user)}
                </span>
            );
        },
    }),
    enrollmentColumnHelper.accessor('course', {
        header: 'Course',
        cell: (info) => {
            const course = info.getValue();
            return (
                <span className="text-zinc-400">
                    {typeof course === 'object' && course ? (course as Course).title : String(course)}
                </span>
            );
        },
    }),
    enrollmentColumnHelper.accessor('progress', {
        header: 'Progress',
        cell: (info) => {
            const progress = info.getValue();
            return (
                <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-violet-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <span className="text-xs font-mono text-zinc-400">{progress}%</span>
                </div>
            );
        },
    }),
    enrollmentColumnHelper.accessor('isCompleted', {
        header: 'Completed',
        cell: (info) => (
            <span
                className={`px-2 py-1 rounded text-xs font-mono border ${info.getValue()
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    : 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
                    }`}
            >
                {info.getValue() ? 'Yes' : 'No'}
            </span>
        ),
    }),
    enrollmentColumnHelper.accessor('enrolledAt', {
        header: 'Enrolled',
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    }),
];

// Generic table renderer component
function DataTable<T>({
    table,
    showActions,
    onEdit,
    onDelete,
    deleteConfirm,
    setDeleteConfirm,
}: {
    table: Table<T>;
    showActions?: boolean;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    deleteConfirm?: string | null;
    setDeleteConfirm?: (id: string | null) => void;
}) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-zinc-950/50 text-zinc-400 uppercase font-mono text-xs">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id} className="border-b border-white/5">
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} className="px-6 py-4 font-medium">
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                            {showActions && <th className="px-6 py-4 font-medium">Actions</th>}
                        </tr>
                    ))}
                </thead>
                <tbody className="divide-y divide-white/5">
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className="hover:bg-zinc-800/30 transition-colors">
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="px-6 py-4">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                            {showActions && (
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        {onEdit && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => onEdit(row.original)}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        )}
                                        {onDelete && setDeleteConfirm && (
                                            <>
                                                {deleteConfirm === (row.original as { _id: string })._id ? (
                                                    <div className="flex gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 text-red-500 hover:bg-red-500/20"
                                                            onClick={() => onDelete(row.original)}
                                                        >
                                                            Confirm
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8"
                                                            onClick={() => setDeleteConfirm(null)}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-500 hover:bg-red-500/20"
                                                        onClick={() =>
                                                            setDeleteConfirm((row.original as { _id: string })._id)
                                                        }
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            {table.getRowModel().rows.length === 0 && (
                <div className="text-center py-12 text-zinc-500">No data found.</div>
            )}
        </div>
    );
}

export function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>('courses');
    const [globalFilter, setGlobalFilter] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Fetch data
    const { data: courses, isLoading: coursesLoading } = useAdminCourses();
    const { data: users, isLoading: usersLoading } = useAdminUsers();
    const { data: enrollments, isLoading: enrollmentsLoading } = useAdminEnrollments();
    const { data: reports, isLoading: reportsLoading } = useAdminReports();
    const deleteCourse = useDeleteCourse();

    const handleEditCourse = (course: Course) => {
        navigate(`/admin/courses/${course._id}`);
    };

    // Tables
    const coursesTable = useReactTable({
        data: courses || [],
        columns: courseColumns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter,
    });

    const usersTable = useReactTable({
        data: users || [],
        columns: userColumns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter,
    });

    const enrollmentsTable = useReactTable({
        data: enrollments || [],
        columns: enrollmentColumns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter,
    });

    const handleDeleteCourse = async (course: Course) => {
        try {
            await deleteCourse.mutateAsync(course._id);
            setDeleteConfirm(null);
        } catch (err) {
            console.error('Failed to delete course:', err);
        }
    };

    const isLoading =
        (activeTab === 'courses' && coursesLoading) ||
        (activeTab === 'users' && usersLoading) ||
        (activeTab === 'enrollments' && enrollmentsLoading);

    const tabs = [
        { id: 'courses' as TabType, label: 'Courses', icon: BookOpen, count: courses?.length || 0 },
        { id: 'users' as TabType, label: 'Users', icon: Users, count: users?.length || 0 },
        { id: 'enrollments' as TabType, label: 'Enrollments', icon: GraduationCap, count: enrollments?.length || 0 },
    ];

    return (
        <div className="min-h-screen bg-zinc-950 pt-32 px-6 pb-20">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">
                            Admin Console
                        </h1>
                        <p className="text-zinc-400">Manage your course empire.</p>
                    </div>
                    {activeTab === 'courses' && (
                        <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" /> Create Course
                        </Button>
                    )}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="glass-panel p-6 rounded-xl border border-white/10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-violet-500/20 rounded-lg">
                                <Users className="w-5 h-5 text-violet-400" />
                            </div>
                            <span className="text-zinc-400 text-sm">Total Users</span>
                        </div>
                        <div className="text-3xl font-bold text-white">
                            {reportsLoading ? '...' : reports?.totalUsers || 0}
                        </div>
                    </div>
                    <div className="glass-panel p-6 rounded-xl border border-white/10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-emerald-500/20 rounded-lg">
                                <BookOpen className="w-5 h-5 text-emerald-400" />
                            </div>
                            <span className="text-zinc-400 text-sm">Total Courses</span>
                        </div>
                        <div className="text-3xl font-bold text-white">
                            {coursesLoading ? '...' : courses?.length || 0}
                        </div>
                    </div>
                    <div className="glass-panel p-6 rounded-xl border border-white/10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                <GraduationCap className="w-5 h-5 text-blue-400" />
                            </div>
                            <span className="text-zinc-400 text-sm">Enrollments</span>
                        </div>
                        <div className="text-3xl font-bold text-white">
                            {reportsLoading ? '...' : reports?.totalEnrollments || 0}
                        </div>
                    </div>
                    <div className="glass-panel p-6 rounded-xl border border-white/10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-yellow-500/20 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-yellow-400" />
                            </div>
                            <span className="text-zinc-400 text-sm">Completion Rate</span>
                        </div>
                        <div className="text-3xl font-bold text-white">
                            {reportsLoading ? '...' : `${reports?.completionRate || 0}%`}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                ? 'bg-violet-600 text-white'
                                : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                            <span className="ml-1 px-2 py-0.5 bg-white/10 rounded text-xs">
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Table Container */}
                <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden bg-zinc-900/50">
                    {/* Toolbar */}
                    <div className="p-4 border-b border-white/5 flex gap-4">
                        <div className="relative max-w-sm w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                placeholder={`Search ${activeTab}...`}
                                value={globalFilter}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                className="w-full bg-zinc-950 border border-white/10 rounded px-10 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
                        </div>
                    ) : (
                        <>
                            {activeTab === 'courses' && (
                                <DataTable
                                    table={coursesTable}
                                    showActions
                                    onEdit={handleEditCourse}
                                    onDelete={handleDeleteCourse}
                                    deleteConfirm={deleteConfirm}
                                    setDeleteConfirm={setDeleteConfirm}
                                />
                            )}
                            {activeTab === 'users' && <DataTable table={usersTable} />}
                            {activeTab === 'enrollments' && <DataTable table={enrollmentsTable} />}
                        </>
                    )}
                </div>
            </div>
            <CreateCourseModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
        </div>
    );
}
