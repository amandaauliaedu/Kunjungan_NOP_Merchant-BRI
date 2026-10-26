import { useState } from 'react';
import VisitDetailModal from './VisitDetailModal.jsx';
import PhotoViewerModal from './PhotoViewerModal.jsx';
import DataTable from './DataTable.jsx';
export default function ReportTable({ rows, columns, exportName, onFilteredChange }) {
  const [row, setRow] = useState(null); const [photo, setPhoto] = useState(null);
  return (<>
    <DataTable rows={rows} columns={columns} exportName={exportName} onFilteredChange={onFilteredChange} onDetail={setRow} onPhoto={setPhoto} />
    <VisitDetailModal row={row} onClose={() => setRow(null)} onPhoto={setPhoto} />
    <PhotoViewerModal info={photo} onClose={() => setPhoto(null)} />
  </>);
}
