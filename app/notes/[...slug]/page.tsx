import FAB from "@/components/FAB";
import mdxComponents from "@/components/mdx";
import { source } from "@/lib/source";
import { getGithubLastEdit } from "fumadocs-core/server";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import defaultMdxComponents from "fumadocs-ui/mdx";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page";
import { notFound } from "next/navigation";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  const currentCourseCode = params.slug?.join("/").split("/")[0];
  if (!page) notFound();

  const MDX = page.data.body;

  const time = await getGithubLastEdit({
    owner: "EnhancedJax",
    repo: "notes.jaxtam.dev",
    path: `content/notes/${page.file.path}`,
  });

  return (
    <>
      <DocsPage
        toc={page.data.toc}
        full={page.data.full}
        lastUpdate={time ? new Date(time) : undefined}
      >
        <DocsTitle>{page.data.title}</DocsTitle>
        <DocsDescription>{page.data.description}</DocsDescription>
        <DocsBody>
          <MDX
            components={{
              ...defaultMdxComponents,
              ...mdxComponents,
              img: (props) => <ImageZoom {...(props as any)} />,
            }}
          />
        </DocsBody>
      </DocsPage>
      <FAB currentCourseCode={currentCourseCode} />
    </>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
