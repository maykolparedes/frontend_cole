import React, { useEffect, useState } from 'react';
import ConductService from '@/services/conductService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ConductRecord {
  id: number;
  estudiante_id: number;
  titulo: string;
  descripcion?: string;
  estado?: string;
}

export default function ConductList() {
  const [items, setItems] = useState<ConductRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await ConductService.list();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to load conduct records', e);
      toast.error('Error al cargar registros de conducta');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id: number) => {
    try {
      await ConductService.approve(String(id));
      toast.success('Registro aprobado');
      // refrescar lista
      await load();
    } catch (e: any) {
      console.error('Approve failed', e);
      toast.error(e?.response?.data?.message || 'Error al aprobar');
    }
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Registros de Conducta</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <div>Cargando...</div>}
          {!loading && items.length === 0 && <div>No hay registros.</div>}
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <div className="font-semibold">{item.titulo}</div>
                  <div className="text-sm text-muted-foreground">{item.descripcion}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm">{item.estado || 'pendiente'}</div>
                  <Button onClick={() => handleApprove(item.id)} size="sm">Aprobar</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
