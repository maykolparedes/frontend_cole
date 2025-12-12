import React, { useEffect, useState } from 'react';
import PromocionService from '@/services/promocionService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';

interface PromocionRecord {
  id: number;
  nombre?: string;
  estado?: string;
  created_at?: string;
}

export default function PromocionesAdmin() {
  const [items, setItems] = useState<PromocionRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [massPayload, setMassPayload] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [massResult, setMassResult] = useState<any | null>(null);
  const { hasPermission, hasRole } = useAuth();

  const load = async () => {
    setLoading(true);
    try {
      const data = await PromocionService.list();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to load promociones', e);
      toast.error('Error al cargar promociones');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id: number) => {
    try {
      await PromocionService.approve(String(id));
      toast.success('Promoción aprobada');
      await load();
    } catch (e: any) {
      console.error('approve error', e);
      toast.error(e?.response?.data?.message || 'Error al aprobar');
    }
  };

  const handleReject = async (id: number) => {
    try {
      await PromocionService.reject(String(id));
      toast.success('Promoción rechazada');
      await load();
    } catch (e: any) {
      console.error('reject error', e);
      toast.error(e?.response?.data?.message || 'Error al rechazar');
    }
  };

  const handleMassPromote = async () => {
    try {
      // Esperamos que backend acepte { estudiantes: [...] } u otra estructura
      const payload = { estudiantes: massPayload.split(/\s*,\s*/).filter(Boolean) };
      const res = await PromocionService.massPromote(payload);
      setMassResult(res);
      toast.success('Promoción masiva iniciada');
      setMassPayload('');
      await load();
    } catch (e: any) {
      console.error('mass promote error', e);
      toast.error(e?.response?.data?.message || 'Error en promoción masiva');
    }
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Promociones</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <div>Cargando...</div>}
          {!loading && items.length === 0 && <div>No hay promociones registradas.</div>}

          <div className="space-y-3">
            {items.map(it => (
              <div key={it.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <div className="font-semibold">{it.nombre || `Promoción #${it.id}`}</div>
                  <div className="text-sm text-muted-foreground">Estado: {it.estado || 'pendiente'}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={() => handleApprove(it.id)}>Aprobar</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleReject(it.id)}>Rechazar</Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h4 className="font-semibold mb-2">Promoción masiva</h4>
            <p className="text-sm text-muted-foreground mb-2">Pegue una lista de IDs de estudiantes separados por comas</p>
            <textarea value={massPayload} onChange={e => setMassPayload(e.target.value)} className="w-full p-2 border rounded" rows={3} />
            <div className="mt-2 flex items-center gap-2">
              <Button
                onClick={() => setConfirmOpen(true)}
                disabled={!(hasPermission('promotion.run') || hasRole('admin'))}
              >
                Ejecutar promoción masiva
              </Button>
              {!hasPermission('promotion.run') && !hasRole('admin') && (
                <div className="text-sm text-muted-foreground">No tienes permiso para ejecutar promociones masivas.</div>
              )}
            </div>
            {/* Confirm dialog */}
            <Dialog open={confirmOpen} onOpenChange={(v) => setConfirmOpen(v)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmar promoción masiva</DialogTitle>
                  <DialogDescription>Vas a promocionar {massPayload.split(/\s*,\s*/).filter(Boolean).length} estudiantes. Esta acción es irreversible.</DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                  <pre className="p-2 bg-slate-50 rounded text-sm max-h-40 overflow-auto">{massPayload}</pre>
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setConfirmOpen(false)}>Cancelar</Button>
                  <Button onClick={() => { setConfirmOpen(false); void handleMassPromote(); }}>Confirmar y ejecutar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
      {/* Result / logs */}
      {massResult && (
        <div className="mt-4 p-4">
          <Card>
            <CardHeader>
              <CardTitle>Resultado promoción masiva</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(massResult, null, 2)}</pre>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
