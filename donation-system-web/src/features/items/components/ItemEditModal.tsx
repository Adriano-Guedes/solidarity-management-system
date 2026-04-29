import React, { useEffect, useState } from 'react';
import { Modal, Form, Row, Col } from 'react-bootstrap';
import RoundedButton from '../../../components/RoundedButton';
import { COLORS } from '../../../constants';
import { getAllItemCategories } from '../../../features/itemCategories/itemCategoryService';
import { getAllItemTemplates } from '../../../features/itemTemplates/itemTemplateService';
import type { ItemCategoryResponse } from '../../../types/itemCategory';
import type { ItemTemplateResponse } from '../../../types/itemTemplate';

interface ItemEditModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  loading?: boolean;
  initialData?: any;
}

const ItemEditModal: React.FC<ItemEditModalProps> = ({ show, onClose, onSave, loading = false, initialData }) => {
  const [form, setForm] = useState<any>(initialData || {});
  const [categories, setCategories] = useState<ItemCategoryResponse[]>([]);
  const [templates, setTemplates] = useState<ItemTemplateResponse[]>([]);

  useEffect(() => {
    getAllItemCategories().then(setCategories);
    getAllItemTemplates().then(setTemplates);
  }, []);

  useEffect(() => {
    setForm(initialData || {});
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <Modal show={show} onHide={onClose} centered backdrop="static" size="lg" style={{ zIndex: 20000 }}>
      <Modal.Body style={{ borderRadius: 18, padding: 0, background: COLORS.white }}>
        <div style={{ padding: '32px 32px 24px 32px', borderRadius: 18, boxShadow: '0 4px 32px rgba(0,0,0,0.10)' }}>
          <h3 style={{ fontWeight: 700, color: COLORS.primary, marginBottom: 28 }}>Editar Item</h3>
          <Form autoComplete="off">
            <Form.Group as={Row} className="mb-0" style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: 16, marginBottom: 16, paddingTop: 16 }}>
              <Form.Label column sm={4} style={{ fontWeight: 600 }}>Nome</Form.Label>
              <Col sm={8}>
                <Form.Control
                  name="name"
                  value={form.name || ''}
                  onChange={handleChange}
                  style={{ borderRadius: 12, background: '#f8fafc', border: '1px solid #e5e7eb' }}
                  autoFocus
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-0" style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: 16, marginBottom: 16, paddingTop: 16 }}>
              <Form.Label column sm={4} style={{ fontWeight: 600 }}>Marca</Form.Label>
              <Col sm={8}>
                <Form.Control
                  name="brand"
                  value={form.brand || ''}
                  onChange={handleChange}
                  style={{ borderRadius: 12, background: '#f8fafc', border: '1px solid #e5e7eb' }}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-0" style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: 16, marginBottom: 16, paddingTop: 16 }}>
              <Form.Label column sm={4} style={{ fontWeight: 600 }}>Categoria</Form.Label>
              <Col sm={8}>
                <Form.Select
                  name="categoryId"
                  value={form.categoryId || ''}
                  onChange={handleChange}
                  style={{ borderRadius: 12, background: '#f8fafc', border: '1px solid #e5e7eb', appearance: 'auto'}}
                >
                  <option value="">Selecione...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </Form.Select>
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-0" style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: 16, marginBottom: 16, paddingTop: 16 }}>
              <Form.Label column sm={4} style={{ fontWeight: 600 }}>Modelo Base</Form.Label>
              <Col sm={8}>
                <Form.Select
                  name="itemTemplateId"
                  value={form.itemTemplateId || ''}
                  onChange={handleChange}
                  style={{ borderRadius: 12, background: '#f8fafc', border: '1px solid #e5e7eb', appearance: 'auto'}}
                >
                  <option value="">Selecione...</option>
                  {templates.map(tpl => (
                    <option key={tpl.id} value={tpl.id}>{tpl.name} ({tpl.categoryName})</option>
                  ))}
                </Form.Select>
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-0" style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: 16, marginBottom: 16, paddingTop: 16 }}>
              <Form.Label column sm={4} style={{ fontWeight: 600 }}>Quantidade por Pacote</Form.Label>
              <Col sm={8}>
                <Form.Control
                  name="packageQuantity"
                  type="number"
                  value={form.packageQuantity || ''}
                  onChange={handleChange}
                  style={{ borderRadius: 12, background: '#f8fafc', border: '1px solid #e5e7eb' }}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-0" style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: 16, marginBottom: 16, paddingTop: 16 }}>
              <Form.Label column sm={4} style={{ fontWeight: 600 }}>Unidade de Medida</Form.Label>
              <Col sm={8}>
                <Form.Control
                  name="unitOfMeasure"
                  value={form.unitOfMeasure || ''}
                  onChange={handleChange}
                  style={{ borderRadius: 12, background: '#f8fafc', border: '1px solid #e5e7eb' }}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-0" style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: 16, marginBottom: 16, paddingTop: 16 }}>
              <Form.Label column sm={4} style={{ fontWeight: 600 }}>Descrição</Form.Label>
              <Col sm={8}>
                <Form.Control
                  as="textarea"
                  name="notes"
                  value={form.notes || ''}
                  onChange={handleChange}
                  style={{ borderRadius: 12, background: '#f8fafc', border: '1px solid #e5e7eb', minHeight: 60 }}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-0" style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: 16, marginBottom: 16, paddingTop: 16, alignItems: 'center' }}>
              <Form.Label column sm={4} style={{ fontWeight: 600 }}>Ativo</Form.Label>
              <Col sm={8} style={{ display: 'flex', alignItems: 'center' }}>
                <Form.Check
                  type="switch"
                  id="active-switch"
                  name="active"
                  checked={!!form.active}
                  onChange={handleChange}
                  style={{ accentColor: COLORS.success, width: 48, height: 28 }}
                  label={form.active ? 'Ativo' : 'Inativo'}
                />
              </Col>
            </Form.Group>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
              <RoundedButton
                onClick={() => onSave(form)}
                background={COLORS.primary}
                color={COLORS.white}
                disabled={loading}
                style={{ minWidth: 120 }}
              >
                Salvar
              </RoundedButton>
              <RoundedButton
                onClick={onClose}
                background={COLORS.textSecondary}
                color={COLORS.white}
                style={{ minWidth: 120, marginLeft: 16 }}
                disabled={loading}
              >
                Cancelar
              </RoundedButton>
            </div>
          </Form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ItemEditModal;
