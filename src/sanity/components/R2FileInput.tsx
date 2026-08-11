import { useCallback, useState } from "react";
import { ObjectInputProps, set, unset } from "sanity";
import { Button, Card, Stack, Text, Flex, Spinner } from "@sanity/ui";

export default function R2FileInput(props: ObjectInputProps) {
  const { onChange, value } = props;
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = useCallback(
    async (file: File) => {
      setUploading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/r2-upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error(`Upload failed: ${res.statusText}`);
        }

        const data = await res.json();

        onChange([
          set(data.url, ["url"]),
          set(data.fileName, ["fileName"]),
          set(data.fileSize, ["fileSize"]),
          set(data.contentType, ["contentType"]),
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) uploadFile(file);
    },
    [uploadFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) uploadFile(file);
    },
    [uploadFile]
  );

  const handleRemove = useCallback(() => {
    onChange(unset());
  }, [onChange]);

  const currentUrl = (value as Record<string, unknown>)?.url as string | undefined;
  const currentName = (value as Record<string, unknown>)?.fileName as string | undefined;
  const currentSize = (value as Record<string, unknown>)?.fileSize as number | undefined;

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Stack space={3}>
      {currentUrl ? (
        <Card padding={3} radius={2} shadow={1} tone="positive">
          <Stack space={2}>
            <Text size={1} weight="semibold">
              {currentName || "Uploaded file"}
            </Text>
            {currentSize && (
              <Text size={1} muted>
                {formatSize(currentSize)}
              </Text>
            )}
            <Text size={0} muted style={{ wordBreak: "break-all" }}>
              {currentUrl}
            </Text>
            <Button text="Remove" tone="critical" mode="ghost" onClick={handleRemove} />
          </Stack>
        </Card>
      ) : (
        <Card
          padding={4}
          radius={2}
          shadow={1}
          tone={dragOver ? "primary" : "default"}
          onDragOver={(e: React.DragEvent) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          style={{ border: "2px dashed", borderColor: dragOver ? "#2276fc" : "#ccc", textAlign: "center" }}
        >
          <Stack space={3}>
            {uploading ? (
              <Flex justify="center" align="center" gap={2}>
                <Spinner />
                <Text size={1}>Uploading to R2...</Text>
              </Flex>
            ) : (
              <>
                <Text size={1} muted>
                  Drag &amp; drop a file here, or
                </Text>
                <input
                  type="file"
                  onChange={handleFileSelect}
                  style={{ display: "none" }}
                  id={`r2-upload-${props.id}`}
                />
                <Button
                  text="Choose File"
                  mode="ghost"
                  onClick={() =>
                    document.getElementById(`r2-upload-${props.id}`)?.click()
                  }
                />
              </>
            )}
          </Stack>
        </Card>
      )}
      {error && (
        <Card padding={2} radius={2} tone="critical">
          <Text size={1}>{error}</Text>
        </Card>
      )}
    </Stack>
  );
}
