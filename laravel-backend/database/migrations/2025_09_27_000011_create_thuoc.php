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
        Schema::create('thuoc', function (Blueprint $table) {
<<<<<<< HEAD
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
=======
            $table->increments("ID_Thuoc");
            $table->string("TenThuoc", 100)->nullable(false);

            $table->unsignedInteger("ID_DVT");
            $table->foreign("ID_DVT")->references("ID_DVT")->on("dvt")->onDelete('cascade');

            $table->unsignedInteger("ID_CachDung");
            $table->foreign("ID_CachDung")->references("ID_CachDung")->on("cach_dung")->onDelete('cascade');

            $table->string("ThanhPhan", 255)->nullable(true);
            $table->string("XuatXu", 100)->nullable(true);
            $table->unsignedInteger("SoLuongTon")->default(0);
            $table->decimal("DonGiaNhap", 10, 2)->nullable(true);
            $table->string("HinhAnh", 255)->nullable(true);
            $table->decimal("TyLeGiaBan", 10, 2)->nullable(true);
            $table->decimal("DonGiaBan", 10, 2)->nullable(true);
            $table->boolean("Is_Deleted")->default(false);
            $table->timestamps();
        });
>>>>>>> 02075ae0e4d568e8f8db04bc53927e1e7039bd00
    }
    
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('thuoc');
    }
};
