package com.jbncakes.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jbncakes.model.Order;
import com.jbncakes.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@RestController
@RequestMapping("/api")
public class OrderController {

    private final OrderService orderService;
    private final ObjectMapper objectMapper;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Autowired
    public OrderController(OrderService orderService, ObjectMapper objectMapper) {
        this.orderService = orderService;
        this.objectMapper = objectMapper;
    }

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    /**
     * Create order — accepts multipart/form-data with:
     *   - "order"  : JSON string of the Order object
     *   - "photo"  : optional reference image file
     * Also still accepts plain application/json for backward compatibility.
     */
    @PostMapping(value = "/orders", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Order> createOrderWithPhoto(
            @RequestPart("order") String orderJson,
            @RequestPart(value = "photo", required = false) MultipartFile photo) throws IOException {

        Order order = objectMapper.readValue(orderJson, Order.class);

        // Save reference photo if provided
        if (photo != null && !photo.isEmpty()) {
            String filename = saveReferencePhoto(photo);
            order.setReferencePhotoPath(filename);
        }

        return new ResponseEntity<>(orderService.createOrder(order), HttpStatus.CREATED);
    }

    @PostMapping(value = "/orders", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        return new ResponseEntity<>(orderService.createOrder(order), HttpStatus.CREATED);
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }

    /** Serve a saved reference photo */
    @GetMapping("/orders/images/{filename:.+}")
    public ResponseEntity<Resource> serveReferencePhoto(@PathVariable String filename) throws IOException {
        Path filePath = Paths.get(uploadDir, "references", filename).toAbsolutePath();
        Resource resource = new UrlResource(filePath.toUri());
        if (!resource.exists() || !resource.isReadable()) {
            return ResponseEntity.notFound().build();
        }
        String contentType = Files.probeContentType(filePath);
        if (contentType == null) contentType = "application/octet-stream";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }

    @GetMapping("/customers")
    public ResponseEntity<List<Map<String, Object>>> getCustomers() {
        List<Order> orders = orderService.getAllOrders();
        Map<String, Map<String, Object>> customerMap = new HashMap<>();

        for (Order order : orders) {
            String key = order.getCustomerPhone();
            if (!customerMap.containsKey(key)) {
                Map<String, Object> customer = new HashMap<>();
                customer.put("name", order.getCustomerName());
                customer.put("phone", order.getCustomerPhone());
                customer.put("email", order.getCustomerEmail());
                customer.put("totalOrders", 1);
                customer.put("totalSpent", order.getTotalAmount());
                customerMap.put(key, customer);
            } else {
                Map<String, Object> customer = customerMap.get(key);
                customer.put("totalOrders", (Integer) customer.get("totalOrders") + 1);
                customer.put("totalSpent", ((java.math.BigDecimal) customer.get("totalSpent")).add(order.getTotalAmount()));
            }
        }
        return ResponseEntity.ok(new ArrayList<>(customerMap.values()));
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    private String saveReferencePhoto(MultipartFile file) throws IOException {
        Path dir = Paths.get(uploadDir, "references").toAbsolutePath();
        Files.createDirectories(dir);

        String original = file.getOriginalFilename();
        String ext = (original != null && original.contains("."))
                ? original.substring(original.lastIndexOf('.'))
                : ".jpg";
        String filename = UUID.randomUUID() + ext;

        Path dest = dir.resolve(filename);
        Files.copy(file.getInputStream(), dest, StandardCopyOption.REPLACE_EXISTING);
        return filename;
    }
}
