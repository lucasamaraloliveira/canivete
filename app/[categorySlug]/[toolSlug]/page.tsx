import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TOOLS, Tool } from '@/constants/tools';
import { Dashboard } from '@/components/Dashboard';

interface Props {
    params: Promise<{
        categorySlug: string;
        toolSlug: string;
    }>;
}

export async function generateStaticParams() {
    return TOOLS.map((tool) => ({
        categorySlug: tool.categorySlug,
        toolSlug: tool.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { categorySlug, toolSlug } = await params;
    const tool = TOOLS.find(
        (t) => t.slug === toolSlug && t.categorySlug === categorySlug
    );

    if (!tool) {
        return {
            title: 'Ferramenta não encontrada',
        };
    }

    return {
        title: `${tool.name} - Canivete`,
        description: tool.description,
        openGraph: {
            title: `${tool.name} - Canivete Suíço`,
            description: tool.description,
            type: 'website',
            url: `https://canivete.pro/${tool.categorySlug}/${tool.slug}`,
        },
        twitter: {
            card: 'summary_large_image',
            title: tool.name,
            description: tool.description,
        },
    };
}

export default async function ToolPage({ params }: Props) {
    const { categorySlug, toolSlug } = await params;
    const tool = TOOLS.find(
        (t) => t.slug === toolSlug && t.categorySlug === categorySlug
    );

    if (!tool) {
        notFound();
    }

    return <Dashboard initialTool={tool} />;
}
