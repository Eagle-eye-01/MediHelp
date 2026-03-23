import type { MedicalDocument } from "@/types";

import { DocumentCard } from "@/components/documents/DocumentCard";

export function DocumentGrid({
  documents,
  onRename,
  onCompress,
  onOpen,
  onDelete
}: {
  documents: MedicalDocument[];
  onRename: (id: string, value: string) => Promise<void>;
  onCompress: (document: MedicalDocument, nextValue: boolean) => Promise<void>;
  onOpen: (document: MedicalDocument) => void;
  onDelete: (document: MedicalDocument) => Promise<void>;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {documents.map((document) => (
        <DocumentCard
          document={document}
          key={document.id}
          onCompress={onCompress}
          onDelete={onDelete}
          onOpen={onOpen}
          onRename={onRename}
        />
      ))}
    </div>
  );
}
