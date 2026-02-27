<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('order_id');
            $table->string('payment_method');
            $table->decimal('amount', 10, 2);
            $table->enum('payment_status', [ 'pending',
                'paid',
                'failed',
                'cancelled'])->default('pending');
            $table->string('transaction_id')->nullable(); // For storing transaction reference from payment gateway
            $table->foreign('user_id')->references('id')->on('users')->onDelete
            ('cascade');
            $table->foreign('order_id')->references('id')->on('orders')->onDelete
            ('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
