'use client';

import React from 'react';
import {
    Search, Menu, X, Code2, Palette, Timer, Atom, Lock, Gamepad2, ChevronRight,
    Moon, Sun, LayoutDashboard, Settings, Info, ExternalLink, Check, Copy,
    RotateCcw, Database, Table, Key, Clock, FileCode, FileDiff, Image as ImageIcon,
    Terminal, Map, Sparkles, RefreshCw, Cpu, FileText, ShieldAlert, PenTool,
    GitBranch, Video, Globe, Waves, FileDown, Layers, Type, Box, Play, Square,
    Scissors, Activity, Sliders, Maximize, Wind, FileImage, Grid, Hash, Dot, Zap,
    CheckSquare, Users, Ruler, QrCode, Volume2, Mic, DollarSign, Binary, Monitor,
    Music, ShieldCheck, Orbit, Dna, Network, CircuitBoard, PieChart, Shuffle,
    CreditCard, Scale, ArrowUpRight, Circle, MapPin, Keyboard, Fingerprint,
    EyeOff, Bomb, Shield, Smartphone, ImageOff, FileCheck, Laugh, Dice5,
    VolumeX, Grid3X3, BookOpen, Subtitles, Printer, Barcode, Code, Heart,
    Mail, MessageSquarePlus, Trash2, Briefcase, Wrench, Files, LockKeyhole, LockKeyholeOpen,
    Languages, Car, ClipboardCheck, Banknote, UserPlus, Building2, Ghost, Command, ScrollText, Crown, Building
} from 'lucide-react';

const iconsMap: Record<string, any> = {
    Code2, Search, Database, Table, Key, Clock, FileCode, Settings, FileDiff,
    ImageIcon, Terminal, LayoutDashboard, Map, Sparkles, RefreshCw,
    Cpu, FileText, ShieldAlert, PenTool, GitBranch, Video, Palette, Globe,
    Waves, FileDown, Layers, Type, Box, Play, Square, Scissors, Activity,
    Sliders, Maximize, Wind, FileImage, Grid, Timer, Hash, Dot, Zap, Lock,
    CheckSquare, Users, Ruler, QrCode, Volume2, Mic, DollarSign, Binary, Monitor,
    Music, ShieldCheck, Atom, Orbit, Dna, Network, CircuitBoard, PieChart,
    Shuffle, CreditCard, Scale, ArrowUpRight, Circle, MapPin, Keyboard,
    Fingerprint, EyeOff, Bomb, Shield, Smartphone, ImageOff, FileCheck, Laugh,
    Dice5, VolumeX, Grid3X3, BookOpen, Subtitles, Printer, Barcode, Code, Trash2,
    Briefcase, Wrench, Heart, Mail, MessageSquarePlus, X, Menu, Sun, Moon,
    ChevronRight, RotateCcw, Info, ExternalLink, Check, Copy, Files, LockKeyhole, LockKeyholeOpen,
    Languages, Car, ClipboardCheck, Banknote, UserPlus, Building2, Ghost, Command, ScrollText, Crown, Building,
    Image: ImageIcon, Layout: LayoutDashboard
};

export const Icon = React.memo(({ name, className }: { name: string; className?: string }) => {
    const LucideIcon = iconsMap[name] || iconsMap[name.replace('Code', 'Code2')] || Code2;
    return <LucideIcon className={className} />;
});

Icon.displayName = 'Icon';
