'use client';
import { Card } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { Site } from "@prisma/client";
import axios from "axios";

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(20);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const loadingRef = useRef<boolean>(false);

  const fetchSites = async () => {
    if (loadingRef.current) {
      return;
    }
    loadingRef.current = true;
    setLoading(true);
    try {
      const response = await axios.get('/api/member/sites', {
        params: {
          page,
          pageSize
        }
      });
      const data = response.data;
      setSites(data.data.sites);
      setHasMore(data.data.sites.length === pageSize);
    } catch (error) {
      console.error("Error fetching sites:", error);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  useEffect(() => {
    fetchSites();
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">网址导航</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sites.map((site) => (
          <Card key={site.id} className="p-4">
            <a
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3"
            >
              {site.icon && (
                <img
                  src={site.icon}
                  alt={site.name}
                  className="w-8 h-8 rounded"
                />
              )}
              <div>
                <h3 className="font-medium">{site.name}</h3>
                {site.description && (
                  <p className="text-sm text-gray-500">{site.description}</p>
                )}
              </div>
            </a>
          </Card>
        ))}
      </div>

      {loading && (
        <div className="text-center mt-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-current border-r-transparent"></div>
        </div>
      )}

      {!loading && hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={() => {
              setPage(p => p + 1);
              fetchSites();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            加载更多
          </button>
        </div>
      )}
    </div>
  );
}
