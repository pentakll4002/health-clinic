<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('thuoc', function (Blueprint $table) {
            $table->increments('ID_Thuoc');
        
            $table->string('TenThuoc');
            $table->text('ThanhPhan')->nullable();
            $table->string('HinhAnh')->nullable();
            $table->string('XuatXu')->nullable();
        
            $table->unsignedInteger('ID_DVT');
            $table->unsignedInteger('ID_CachDung');
        
            $table->integer('SoLuongTon')->default(0);
        
            $table->decimal('DonGiaNhap', 15, 2);
            $table->decimal('DonGiaBan', 15, 2);
            $table->decimal('TyLeGiaBan', 5, 2)->nullable();
        
            $table->boolean('Is_Deleted')->default(0);
            $table->timestamps();
        
            $table->foreign('ID_DVT')
                  ->references('ID_DVT')->on('dvt');
        
            $table->foreign('ID_CachDung')
                  ->references('ID_CachDung')->on('cach_dung');
        });        
    }
    
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('thuoc');
    }
};
