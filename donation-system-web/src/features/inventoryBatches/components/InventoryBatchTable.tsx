import React, { useState } from 'react';
import { Accordion } from 'react-bootstrap';
import { COLORS } from '../../../constants';
import type { InventoryBatchResponse } from '../../../types/inventoryBatch';
import { formatDateBR, formatDateTimeBR } from '../../../utils/dateFormat';
import RoundedButton from '../../../components/RoundedButton';

interface InventoryBatchTableProps {
    batches: InventoryBatchResponse[];
}

const InventoryBatchTable: React.FC<InventoryBatchTableProps> = ({ batches }) => {
    const [activeKey, setActiveKey] = useState<string | null>(null);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {batches.map((batch, idx) => (
                <div
                    key={batch.id}
                    style={{
                        background: COLORS.white,
                        borderRadius: 16,
                        boxShadow: '0 4px 18px rgba(0,0,0,0.07)',
                        padding: 0,
                        border: '1px solid #e5e7eb',
                        overflow: 'hidden',
                    }}
                >
                    <Accordion activeKey={activeKey} onSelect={k => setActiveKey(k as string | null)}>
                        <Accordion.Item eventKey={String(idx)} style={{ border: 'none', background: 'transparent' }}>
                            <Accordion.Header as="div" style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', width: '100%', padding: 24 }}>
                                    <div style={{ flex: 2 }}>
                                        <div style={{ fontWeight: 600, color: COLORS.primary, fontSize: 18 }}>
                                            Expira: {formatDateBR(batch.expirationDate)}
                                        </div>
                                        <div style={{ fontSize: 13, color: COLORS.textSecondary || '#64748B', marginTop: 2 }}>
                                            Criado: {formatDateTimeBR(batch.createdAt)}
                                        </div>
                                    </div>
                                    <div style={{ flex: 1, textAlign: 'center' }}>
                                        <div style={{ fontSize: 13, color: COLORS.textSecondary || '#64748B' }}>Qtd Disponível</div>
                                        <div style={{ fontWeight: 700, fontSize: 20, color: COLORS.secondary }}>{batch.quantityAvailable}</div>
                                    </div>
                                    <div style={{ flex: 1, textAlign: 'center' }}>
                                        <div style={{ fontSize: 13, color: COLORS.textSecondary || '#64748B' }}>Atualizado</div>
                                        <div style={{ fontWeight: 500, fontSize: 15 }}>{formatDateTimeBR(batch.updatedAt)}</div>
                                    </div>
                                </div>
                            </Accordion.Header>
                            <Accordion.Body style={{ background: COLORS.background, padding: 24 }}>
                                <div className='row'>
                                    <div className='col-9'>
                                        <div style={{ color: COLORS.primary, fontWeight: 500 }}>
                                            <div>Lote ID: {batch.id}</div>
                                        </div>
                                    </div>
                                    <div className='col-3'>
                                        <RoundedButton color={COLORS.white} background={COLORS.textSecondary} onClick={() => { }}>Editar</RoundedButton>
                                    </div>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>
            ))}
        </div>
    );
};

export default InventoryBatchTable;
