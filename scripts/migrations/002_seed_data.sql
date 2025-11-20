-- EcoforMarket Seed Data
-- Version: 1.0.0
-- Description: Sample data for testing and development

-- Insert admin user
-- Password: Admin123! (hashed with bcrypt)
INSERT INTO users (email, password_hash, user_type, role, name, rut, phone, address, city, region, is_active, email_verified) VALUES
('admin@ecoformarket.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7uCvOvDuBS', 'company', 'admin', 'Administrador Sistema', '76.543.210-1', '+56912345678', 'Av. Principal 123', 'Santiago', 'Metropolitana', true, true);

-- Insert retail clients
INSERT INTO users (email, password_hash, user_type, role, name, rut, phone, address, city, region) VALUES
('cliente1@email.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7uCvOvDuBS', 'person', 'retail_client', 'Juan Pérez', '12.345.678-9', '+56987654321', 'Calle Los Aromos 456', 'Valparaíso', 'Valparaíso'),
('cliente2@email.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7uCvOvDuBS', 'person', 'retail_client', 'María González', '23.456.789-0', '+56976543210', 'Pasaje Los Pinos 789', 'Concepción', 'Bío Bío');

-- Insert wholesale clients
INSERT INTO users (email, password_hash, user_type, role, name, company_name, rut, phone, address, city, region) VALUES
('empresa1@email.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7uCvOvDuBS', 'company', 'wholesale_client', 'Pedro Martínez', 'Distribuidora EcoPlus Ltda.', '76.123.456-7', '+56965432109', 'Av. Industrial 321', 'La Serena', 'Coquimbo'),
('empresa2@email.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7uCvOvDuBS', 'company', 'wholesale_client', 'Ana Silva', 'Comercial SustentaChile S.A.', '76.987.654-3', '+56954321098', 'Camino al Parque 654', 'Puerto Montt', 'Los Lagos');

-- Insert products (eco-friendly categories)
INSERT INTO products (name, description, category, brand, sku, price_retail, price_wholesale, min_wholesale_quantity, stock, image_url, is_featured) VALUES
-- Papel Higiénico
('Papel Higiénico Ecológico Doble Hoja 4 Rollos', 'Papel higiénico 100% reciclado, suave y resistente. Doble hoja para mayor comodidad.', 'Papel Higiénico', 'EcoConfort', 'ECO-PH-001', 3500.00, 2800.00, 20, 150, '/placeholder.svg?height=400&width=400', true),
('Papel Higiénico Premium Triple Hoja 8 Rollos', 'Papel higiénico premium con triple capa, hipoalergénico y biodegradable.', 'Papel Higiénico', 'EcoLux', 'ECO-PH-002', 7200.00, 5900.00, 15, 200, '/placeholder.svg?height=400&width=400', true),
('Papel Higiénico Familiar 16 Rollos', 'Pack familiar de papel higiénico ecológico, ideal para uso doméstico prolongado.', 'Papel Higiénico', 'EcoFamily', 'ECO-PH-003', 12800.00, 10500.00, 10, 120, '/placeholder.svg?height=400&width=400', false),
('Papel Higiénico Rendidor 24 Rollos', 'Súper pack rendidor con 24 rollos de papel reciclado de alta calidad.', 'Papel Higiénico', 'EcoConfort', 'ECO-PH-004', 18900.00, 15500.00, 8, 80, '/placeholder.svg?height=400&width=400', true),

-- Papel Toalla
('Papel Toalla Cocina 2 Rollos', 'Papel toalla absorbente y resistente, perfecto para cocina. Hecho con fibras recicladas.', 'Papel Toalla', 'EcoClean', 'ECO-PT-001', 2800.00, 2200.00, 25, 180, '/placeholder.svg?height=400&width=400', false),
('Papel Toalla Multiuso 4 Rollos', 'Papel toalla extra absorbente para múltiples usos en el hogar.', 'Papel Toalla', 'EcoClean', 'ECO-PT-002', 5400.00, 4300.00, 20, 160, '/placeholder.svg?height=400&width=400', false),
('Papel Toalla Industrial 6 Rollos', 'Papel toalla de alto rendimiento para uso industrial y comercial.', 'Papel Toalla', 'EcoPro', 'ECO-PT-003', 8900.00, 7200.00, 12, 95, '/placeholder.svg?height=400&width=400', true),

-- Servilletas
('Servilletas Ecológicas 100 Unidades', 'Servilletas de papel reciclado, suaves y resistentes. Color natural.', 'Servilletas', 'EcoTable', 'ECO-SV-001', 1500.00, 1100.00, 30, 250, '/placeholder.svg?height=400&width=400', false),
('Servilletas Premium Blancas 200 Unidades', 'Servilletas de celulosa blanca ecológica, ideales para eventos.', 'Servilletas', 'EcoLux', 'ECO-SV-002', 2900.00, 2300.00, 25, 200, '/placeholder.svg?height=400&width=400', false),
('Servilletas de Bambú 150 Unidades', 'Servilletas fabricadas con fibra de bambú 100% sustentable.', 'Servilletas', 'BambooEco', 'ECO-SV-003', 3200.00, 2600.00, 20, 140, '/placeholder.svg?height=400&width=400', true),

-- Pañuelos
('Pañuelos Faciales Caja 120 Unidades', 'Pañuelos faciales suaves e hipoalergénicos en caja dispensadora.', 'Pañuelos', 'EcoSoft', 'ECO-PN-001', 1800.00, 1400.00, 35, 220, '/placeholder.svg?height=400&width=400', false),
('Pañuelos de Bolsillo Pack 10 Sobres', 'Pañuelos de bolsillo individuales, perfectos para llevar.', 'Pañuelos', 'EcoSoft', 'ECO-PN-002', 2500.00, 2000.00, 25, 180, '/placeholder.svg?height=400&width=400', false),

-- Bolsas Ecológicas
('Bolsas Reutilizables Tela 3 Unidades', 'Set de 3 bolsas de tela 100% algodón orgánico, lavables y duraderas.', 'Bolsas', 'EcoBag', 'ECO-BL-001', 4500.00, 3600.00, 15, 130, '/placeholder.svg?height=400&width=400', true),
('Bolsas Compostables 50 Unidades', 'Bolsas biodegradables y compostables para basura orgánica.', 'Bolsas', 'EcoWaste', 'ECO-BL-002', 3800.00, 3000.00, 20, 170, '/placeholder.svg?height=400&width=400', false),
('Bolsas de Malla para Frutas 5 Unidades', 'Bolsas de malla reutilizables para comprar frutas y verduras a granel.', 'Bolsas', 'EcoShop', 'ECO-BL-003', 5200.00, 4200.00, 12, 110, '/placeholder.svg?height=400&width=400', true),

-- Limpieza
('Detergente Líquido Ecológico 1L', 'Detergente biodegradable para ropa, libre de fosfatos y químicos agresivos.', 'Limpieza', 'EcoClean', 'ECO-LM-001', 4800.00, 3900.00, 18, 145, '/placeholder.svg?height=400&width=400', false),
('Jabón Líquido Manos 500ml', 'Jabón líquido natural con aceites esenciales, pH balanceado.', 'Limpieza', 'EcoSoap', 'ECO-LM-002', 2900.00, 2300.00, 25, 190, '/placeholder.svg?height=400&width=400', false),
('Desinfectante Multiuso Natural 750ml', 'Desinfectante ecológico con extractos naturales, elimina 99.9% de bacterias.', 'Limpieza', 'EcoClean', 'ECO-LM-003', 3500.00, 2800.00, 20, 160, '/placeholder.svg?height=400&width=400', true);

-- Insert sample order
INSERT INTO orders (user_id, order_number, status, total_amount, payment_method, shipping_address, shipping_city, shipping_region, notes)
SELECT id, 'ORD-2024-0001', 'confirmed', 45300.00, 'Transferencia', 'Calle Los Aromos 456', 'Valparaíso', 'Valparaíso', 'Entregar en horario de mañana'
FROM users WHERE email = 'cliente1@email.com';

-- Insert order items for the sample order
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
SELECT 
    o.id,
    p.id,
    CASE p.sku
        WHEN 'ECO-PH-001' THEN 4
        WHEN 'ECO-PT-001' THEN 6
        WHEN 'ECO-SV-001' THEN 3
        ELSE 1
    END as quantity,
    p.price_retail,
    CASE p.sku
        WHEN 'ECO-PH-001' THEN 4 * p.price_retail
        WHEN 'ECO-PT-001' THEN 6 * p.price_retail
        WHEN 'ECO-SV-001' THEN 3 * p.price_retail
        ELSE p.price_retail
    END as subtotal
FROM orders o
CROSS JOIN products p
WHERE o.order_number = 'ORD-2024-0001'
AND p.sku IN ('ECO-PH-001', 'ECO-PT-001', 'ECO-SV-001');

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Seed data inserted successfully!';
    RAISE NOTICE 'Admin user: admin@ecoformarket.com / Admin123!';
    RAISE NOTICE 'Test users created with same password: Admin123!';
END $$;
